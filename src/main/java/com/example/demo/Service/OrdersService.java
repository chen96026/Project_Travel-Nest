package com.example.demo.Service;

import java.util.List;
import java.util.Map;

import com.example.demo.Model.Orders;

public interface OrdersService {
	
	public Orders saveOrder(Orders order);
	
	public List<Orders> getAllOrders();
	
	public Orders getOrderById(long oid);
	
	public List<Map<String, Object>> getOrdersWithContactName();
	
	public Orders getOrderByOrderNumber(String orderNumber);
	
	public List<Map<String, Object>> getOrderWithPartialOrderNumber(String orderNumber);
	
	
}