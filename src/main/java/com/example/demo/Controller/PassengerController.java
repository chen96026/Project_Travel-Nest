package com.example.demo.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.BindingResult;
import java.util.stream.Collectors;

import com.example.demo.Model.Orders;
import com.example.demo.Model.Orders.PassengerOrderRequest;
import com.example.demo.Model.Passenger;
import com.example.demo.Service.OrdersService;
import com.example.demo.Service.PassengerService;

import jakarta.validation.Valid;

@RequestMapping("/passenger")
@RestController
public class PassengerController {

	@Autowired
	private PassengerService passengerService;
	
	@Autowired
	private OrdersService ordersService;

	@PostMapping("/createpassenger")
	public ResponseEntity<Object> createPassenger(@Valid @RequestBody PassengerOrderRequest requestBody, BindingResult result) {
	    List<Passenger> passengers = requestBody.getPassengers();
	    Long orderId = requestBody.getOrderId();
	    
	    if (result.hasErrors()) {
	    	String errorMessage = result.getAllErrors().stream()
	    								.map(DefaultMessageSourceResolvable::getDefaultMessage)
	    								.collect(Collectors.joining(", "));
	    	return ResponseEntity.badRequest().body("Validation Error: " + errorMessage);
	    }

	    if (passengers == null || passengers.isEmpty()) {
	        return ResponseEntity.badRequest().body("Passenger list cannot be empty");
	    }

	    // 檢查每個乘客的 contactId 是否存在
	    for (Passenger passenger : passengers) {
	        if (passenger.getContactId() == null) {
	            return ResponseEntity.badRequest().body("Contact ID is required for all passengers");
	        }
	        
	        // 設定 orders 給每個乘客
	        Orders orders = new Orders();
	        orders.setOid(orderId);
	        passenger.setOrders(orders);
	    }

	    try {
	        // 保存乘客資料
	        List<Passenger> savedPassengers = passengerService.savePassengers(passengers);
	        return ResponseEntity.ok(savedPassengers); // 返回成功的乘客資料
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Internal Server Error: " + e.getMessage());
	    }
	}
	
	
	
	@GetMapping("/getpassenger")
	public List<Passenger> getAllPassenger() {
		return passengerService.getAllPassengers();

	}

}