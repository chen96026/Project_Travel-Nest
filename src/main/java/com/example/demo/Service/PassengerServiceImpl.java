package com.example.demo.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.Passenger;
import com.example.demo.Repository.PassengerRepository;

@Service
public class PassengerServiceImpl implements PassengerService{
	
	@Autowired 
	private PassengerRepository passengerRepository;
	
	@Override
	public Passenger savePassenger(Passenger passenger) {
		return passengerRepository.save(passenger);
	}

	@Override
	public List<Passenger> getAllPassengers() {	
		return passengerRepository.findAll();
	}

	@Override
	public Passenger getPassengerById(Long pid) {
		Passenger passenger =  passengerRepository.findById(pid).orElse(null);
		return passenger;
	}

	@Override
	public List<Passenger> savePassengers(List<Passenger> passengers) {
		return passengerRepository.saveAll(passengers);
	}




}
