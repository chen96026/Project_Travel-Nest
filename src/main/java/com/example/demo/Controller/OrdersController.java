package com.example.demo.Controller;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.demo.Model.Contact;
import com.example.demo.Model.Luggage;
import com.example.demo.Model.Member;
import com.example.demo.Model.Orders;
import com.example.demo.Model.Orders.OrderStatus;
import com.example.demo.Model.Passenger;
import com.example.demo.Model.Plane;
import com.example.demo.Repository.ContactRepository;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.Repository.OrdersRepository;
import com.example.demo.Service.ContactService;
import com.example.demo.Service.EcpayService;
import com.example.demo.Service.LuggagesService;
import com.example.demo.Service.OrdersService;
import com.example.demo.Service.PassengerService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/orders")
public class OrdersController {

	@Autowired
	private OrdersService ordersService;

	@Autowired
	private ContactRepository contactRepository;

	@Autowired
	private ContactService contactService;

	@Autowired
	private PassengerService passengerService;

	@Autowired
	private LuggagesService luggagesService;

	@Autowired
	private EcpayService ecpayService;

	@Autowired
	private MemberRepository memberRepository;

	@Autowired
	private OrdersRepository ordersRepository;

	@PostMapping("/createContact")
	public ResponseEntity<Contact> createContact(@RequestBody Contact contact) {
		Contact savedContact = contactRepository.save(contact);
		return ResponseEntity.ok(savedContact);
	}

	@PostMapping("/createOrder")
	public ResponseEntity<Object> createOrder(@RequestBody Orders order, @RequestParam String uid) {

		if (order.getCreateDate() == null) {
			order.setCreateDate(LocalDateTime.now());
		}
		order.setOrderStatus(OrderStatus.尚未付款);

		Orders savedOrder = ordersService.saveOrder(order);

		String orders;
		Member member = memberRepository.findByUid(uid);
		if (member.getOrders() != null && !member.getOrders().isEmpty()) {
			orders = member.getOrders() + "," + order.getOrderNumber();
		} else {
			orders = order.getOrderNumber();
		}
		member.setOrders(orders);
		memberRepository.save(member);

		for (Passenger passenger : order.getPassengerList()) {
			passenger.setOrders(savedOrder);
			passengerService.savePassenger(passenger);

			List<Luggage> luggageList = new ArrayList<>();
			for (Luggage luggage : passenger.getLuggageList()) {
				luggage.setPassenger(passenger);
				luggageList.add(luggage);
			}

			if (!luggageList.isEmpty()) {
				luggagesService.saveAllLuggages(luggageList);
			}
		}

		return ResponseEntity.ok(savedOrder);
	}

	@GetMapping("/Complete/{oid}")
	public String getOrderById(@PathVariable("oid") Long oid, Model model, HttpSession session) {
		Orders order = ordersService.getOrderById(oid);
		if (order == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "訂單未找到"); // 處理未找到訂單的情況
		}

		session.setAttribute("currentOrderId", oid);

		LocalDateTime createDate = order.getCreateDate();
		LocalDateTime adjustedTime = createDate.plusHours(1);

		if (LocalDateTime.now().isAfter(adjustedTime) && order.getOrderStatus() != OrderStatus.已付款完成) {

			order.setOrderStatus(OrderStatus.逾期付款已取消);
			ordersService.saveOrder(order);
			model.addAttribute("message", "訂單已逾期，請重新下單");
			return "order_expired"; // 跳轉到訂單逾期頁面
		}

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
		DateTimeFormatter formatterISO = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
		String formattedCreateDateTime = order.getCreateDate().format(formatter);
		String payBeforeTimeISO = adjustedTime.format(formatterISO);
		String payBeforeTime = adjustedTime.format(formatter);

		Contact contact = contactRepository.findByCId(order.getContactId());

		DecimalFormat df = new DecimalFormat("#,###");
		String formattedPrice = df.format(order.getFinalPrice());

		model.addAttribute("order", order);
		model.addAttribute("contactName", contact.getContactName());
		model.addAttribute("contactEmail", contact.getContactEmail());
		model.addAttribute("contactPhone", contact.getContactPhone());
		model.addAttribute("formattedCreateDateTime", formattedCreateDateTime);
		model.addAttribute("payBeforeTime", payBeforeTime);
		model.addAttribute("formattedPrice", formattedPrice);
		model.addAttribute("payBeforeTimeISO", payBeforeTimeISO);

		return "order_complete";
	}

	@GetMapping("/getoid")
	public ResponseEntity<Map<String, Object>> getOid(HttpSession session) {
		Long oid = (Long) session.getAttribute("currentOrderId");
		if (oid == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}

		Map<String, Object> response = new HashMap<>();
		response.put("oid", oid);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/checkout/{oid}")
	public ResponseEntity<String> checkout(@PathVariable Long oid) {
		String paymentForm = ecpayService.ecpayCheckout(oid);
		return ResponseEntity.ok(paymentForm);
	}

	@PostMapping("/Toback")
	public ResponseEntity<String> handleEcpayCallback(@RequestParam Map<String, String> params) {
		params.forEach((key, value) -> {
			System.out.println(key + ": " + value);
		});
		try {
			String orderNumber = params.get("MerchantTradeNo");
			String paymentStatus = params.get("RtnCode");

			if ("1".equals(paymentStatus)) { // 支付成功
				Orders order = ordersService.getOrderByOrderNumber(orderNumber);
				if (order != null) {
					order.setOrderStatus(Orders.OrderStatus.已付款完成);
					ordersService.saveOrder(order);
					System.out.println("Order updated: " + orderNumber);
				} else {
					System.out.println("Order not found: " + orderNumber);
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
				}
			} else {
				System.out.println("Payment failed for order: " + orderNumber);
			}

			return ResponseEntity.ok("OK");

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error");
		}

	}

	@GetMapping("/order")
	public String order() {

		return "order";
	}

	@GetMapping("/order_admin")
	public String showOrderAdminPage(Model model) {
		return "/back/order_admin"; // 返回 order_admin.html
	}

	// 倒數計時截止時間
	@GetMapping("/payBeforeTime/{oid}")
	public ResponseEntity<Map<String, Object>> getPayBeforeTime(@PathVariable("oid") Long oid) {
		Orders order = ordersService.getOrderById(oid);
		if (order == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

		LocalDateTime createDate = order.getCreateDate();
		LocalDateTime adjustedTime = createDate.plusHours(1);

		DateTimeFormatter formatterISO = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
		String payBeforeTimeISO = adjustedTime.format(formatterISO);

		Map<String, Object> response = new HashMap<>();
		response.put("payBeforeTimeISO", payBeforeTimeISO);

		return ResponseEntity.ok(response);
	}

	// 訂單逾期取消
	@PostMapping("/ordercancel")
	public String OrderCancel(HttpSession session, Model model) {
		Long oid = (Long) session.getAttribute("currentOrderId");
		if (oid == null) {
			model.addAttribute("message", "無效的訂單ID");
			return "order_expired"; // 跳轉到訂單逾期頁面
		}

		Orders order = ordersService.getOrderById(oid);
		if (order != null) {
			if (order.getOrderStatus() != OrderStatus.已付款完成) {
				order.setOrderStatus(OrderStatus.逾期付款已取消);
				ordersService.saveOrder(order);
				model.addAttribute("message", "訂單已逾期，請重新下單");
				return "order_expired";
			} else {
				model.addAttribute("message", "訂單已付款，無法更新狀態");
				return "memberpage";
			}
		} else {
			model.addAttribute("message", "訂單未找到");
			return "order_expired";
		}
	}

	@GetMapping("/order_expired")
	public String showOrderExpiredPage() {

		return "order_expired";
	}
}