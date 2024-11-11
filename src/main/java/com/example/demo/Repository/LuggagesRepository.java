package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Model.Luggage;

public interface LuggagesRepository extends JpaRepository<Luggage, Long>{
	List<Luggage> findByPassengerPid(Long pid);
}
