package com.example.demo.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.Luggage;
import com.example.demo.Repository.LuggagesRepository;

@Service
public class LuggagesServiceImpl implements LuggagesService{
	
	@Autowired
	private LuggagesRepository luggagesRepository;
	
    public Luggage saveLuggage(Luggage luggage) {
        return luggagesRepository.save(luggage);
    }
	
	@Override
    public List<Luggage> saveAllLuggages(List<Luggage> luggageList) {
        return luggagesRepository.saveAll(luggageList);
    }

	@Override
	public List<Luggage> getAllLuggages() {
		return luggagesRepository.findAll();
	}

	@Override
	public Luggage getLuggageById(Long lid) {
		return luggagesRepository.findById(lid).orElse(null);
	}

	@Override
	public List<Luggage> getLuggagesByPassengerId(Long pid) {
		return luggagesRepository.findByPassengerPid(pid);
	}

}
