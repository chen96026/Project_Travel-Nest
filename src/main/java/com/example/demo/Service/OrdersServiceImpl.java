package com.example.demo.Service;

import java.sql.Timestamp;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.apache.catalina.filters.AddDefaultCharsetFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.Orders;
import com.example.demo.Repository.OrdersRepository;

import com.example.demo.Service.OrdersService;

@Service
public class OrdersServiceImpl implements OrdersService{
	
	@Autowired
	private OrdersRepository ordersRepository;

	@Override
	public Orders saveOrder(Orders order) {
		return ordersRepository.save(order);
	}

	@Override
	public List<Orders> getAllOrders() {
		return ordersRepository.findAll();
	}

	@Override
	public Orders getOrderById(long oid) {
		return ordersRepository.findById(oid).orElse(null);
	}

	@Override
	public List<Map<String, Object>> getOrdersWithContactName() {
		 List<Object[]> results = ordersRepository.findOrdersWithContactName();
		 List<Map<String, Object>> ordersWithContact = new ArrayList<>();
		 
		 DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		 
		 for(Object[] row : results) {
			 Map<String, Object> orderMap = new HashMap<>();
			 orderMap.put("orderNumber", row[0]);
			 orderMap.put("contactName", row[1]);
			 
			 Double finalPrice = (Double) row[2];
			 String formattedPrice = formatCurrency(finalPrice);
			 orderMap.put("finalPrice", formattedPrice);
			 
			 Timestamp timestamp = (Timestamp) row[3];
			 LocalDateTime createDate = convertToLocalDateTime(timestamp);
			 orderMap.put("createDate", createDate.format(formatter));
			 
			 String orderStatus = (String) row[4];
			 orderMap.put("orderStatus", orderStatus);
			 
			 ordersWithContact.add(orderMap);
		 }
		 
		return ordersWithContact;
		
	}

	private String formatCurrency(Double price) {
		NumberFormat currencyFormat = NumberFormat.getNumberInstance(Locale.TAIWAN);
		currencyFormat.setMaximumFractionDigits(0);
		return currencyFormat.format(price);
	}

	private LocalDateTime convertToLocalDateTime(Timestamp timestamp) {
		if(timestamp != null) {
			return timestamp.toLocalDateTime();
		}
		return null;
	}

	@Override
	public Orders getOrderByOrderNumber(String orderNumber) {
		return ordersRepository.findByOrderNumber(orderNumber);
	}
	
	

	@Override
	public List<Map<String, Object>> getOrderWithPartialOrderNumber(String orderNumber) {
		List<Orders> ordersList = ordersRepository.findByOrderNumberContain(orderNumber);
		List<Map<String, Object>> result = new ArrayList<>();
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
				
	for(Orders order : ordersList) {
    		Map<String, Object> orderMap = new HashMap<>();
    		orderMap.put("orderNumber", order.getOrderNumber());
            orderMap.put("contactName", order.getContactInformation().getContactName());
            orderMap.put("finalPrice", order.getFinalPrice());
            orderMap.put("createDate", order.getCreateDate().toString());
            orderMap.put("orderStatus", order.getOrderStatus());
         	result.add(orderMap);		
		}
 		return result;
	}

	

}