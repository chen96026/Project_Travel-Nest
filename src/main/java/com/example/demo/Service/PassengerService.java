package com.example.demo.Service;

import java.util.List;

import com.example.demo.Model.Passenger;

public interface PassengerService {
	
	public Passenger savePassenger(Passenger passenger);
	
	public List<Passenger> savePassengers(List<Passenger> passengers);
	
	public List<Passenger> getAllPassengers();
	 
	public Passenger getPassengerById(Long pid);
	
}
