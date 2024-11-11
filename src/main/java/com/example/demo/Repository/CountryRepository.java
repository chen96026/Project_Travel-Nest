package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.example.demo.Model.Country;

public interface CountryRepository extends JpaRepository<Country,Long>{

	List<Country> findByCountry(@Param("country") String country);
	List<Country> findByCountryStartingWithIgnoreCaseOrCityStartingWithIgnoreCase(String country, String city);
	boolean existsByCountry(String country);
    boolean existsByCity(String city);
}
