package com.example.demo.Service;

import java.util.List;

import com.example.demo.Model.Luggage;

public interface LuggagesService {
	
	
	public List<Luggage> saveAllLuggages(List<Luggage> luggages);
	
    public List<Luggage> getAllLuggages();
	
	public Luggage getLuggageById(Long lid);
	
	public List<Luggage> getLuggagesByPassengerId(Long pid);

}
