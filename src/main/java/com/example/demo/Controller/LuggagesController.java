package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Luggage;
import com.example.demo.Model.Orders;
import com.example.demo.Model.Passenger;
import com.example.demo.Service.LuggagesService;
import com.example.demo.Service.OrdersService;
import com.example.demo.Service.PassengerService;

@RestController
@RequestMapping("/luggage")
public class LuggagesController {
	
	@Autowired
	public LuggagesService luggagesService;
	
	@Autowired
	public PassengerService passengerService;
	
	@Autowired
	public OrdersService ordersService;
	
	
	@PostMapping("/createluggages")
	public List<Luggage> createLuggages(@RequestBody List<Luggage> luggageList) {
		try {
	        for (Luggage luggage : luggageList) {
	            Passenger passenger = passengerService.getPassengerById(luggage.getPassenger().getPid());
	            Orders orders = ordersService.getOrderById(luggage.getOrders().getOid());

	            if (passenger == null) {
	                throw new IllegalArgumentException("Invalid Passenger ID: " + luggage.getPassenger().getPid());
	            }
	            if (orders == null) {
	                throw new IllegalArgumentException("Invalid Order ID: " + luggage.getOrders().getOid());
	            }

	            luggage.setPassenger(passenger);
	            luggage.setOrders(orders);
	        }

	        return luggagesService.saveAllLuggages(luggageList);
	    } catch (Exception e) {
	        System.err.println("Error processing luggage data: " + e.getMessage());
	        throw e;
	    }
	}
	
	@GetMapping("/getluggages")
	public List<Luggage> getAllLuggages(){
		return luggagesService.getAllLuggages();
	}
	
	
	@GetMapping("/{lid}")
	public Luggage getLuggageById(@PathVariable Long lid) {
		return luggagesService.getLuggageById(lid);
	}
	
	
	@GetMapping("/passenger/{pid}")
	public List<Luggage> getLuggagesByPassengerId(@PathVariable Long pid){
		return luggagesService.getLuggagesByPassengerId(pid);
	}
	
	

}
