package com.example.demo.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Service.OrdersService;


@RestController
public class OrderAdminController {
	
	@Autowired
    private OrdersService ordersService;

    @GetMapping("/orders/order_admin_json")
    public List<Map<String, Object>> getOrderAdminData(@RequestParam(value = "orderNumber", required = false) String orderNumber) {
      if(orderNumber != null && !orderNumber.isEmpty()) {
	    	return ordersService.getOrderWithPartialOrderNumber(orderNumber);
	  }else {
	    	return ordersService.getOrdersWithContactName();
	  }
    }
}