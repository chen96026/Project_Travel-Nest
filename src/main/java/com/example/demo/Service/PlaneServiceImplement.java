package com.example.demo.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.CityPrice;
import com.example.demo.dto.PlaneTimeZoneDTO;
import com.example.demo.Model.Country;
import com.example.demo.Model.Plane;
import com.example.demo.Repository.CountryRepository;
import com.example.demo.Repository.PlaneRepository;

@Service
public class PlaneServiceImplement implements PlaneService{
	
	@Autowired
    private PlaneRepository planeRepository;
	
	@Autowired
	private CountryRepository countryRepository;

	public List<Plane> getFlightsByCountry(String country) {
        return planeRepository.findByCountry(country);
    }
	
	public List<Country> getCountriesByName(String countryName) {
        return countryRepository.findByCountry(countryName);
    }
    
	public Plane findCheapestFlight(String country) {
        // 1. 查找對應的城市和機場
        List<Country> countries = countryRepository.findByCountry(country);
        List<String> airports = countries.stream()
                .map(Country::getAirport)
                .collect(Collectors.toList());

        // 2. 查找對應的航班
        List<Plane> flights = planeRepository.findByAirportIn(airports);

        // 3. 找到價格最低的航班
        return flights.stream()
                .min(Comparator.comparingDouble(Plane::getEco_price))
                .orElse(null); // 如果沒有找到航班，返回 null
    }
	
	public List<CityPrice> getCitiesAndCheapestFlights(String country) {
        return planeRepository.findCityAndCheapestFlightByCountry(country);
    }
	
	public List<String> findCitiesByCountry(String country) {
        return planeRepository.findCitiesByCountry(country);
    }
	
	public Double findCheapestFlightByCity(String city) {
        return planeRepository.findLowestPriceByCity(city);
    }
	
	public List<Object[]> getMinPricesByCountry() {
        return planeRepository.findMinPriceByCountry();
    }

	@Override
	public List<Plane> searchFlights(String departureCountry, String arrivalCity, LocalDate departureDate,
			int requiredSeats) {
		return planeRepository.findFlights(departureCountry, arrivalCity, departureDate, requiredSeats);
	}

	@Override
	public List<PlaneTimeZoneDTO> findFlightsWithTimeZone(String departureCountry, String arrivalCity,
			LocalDate departureDate, int requiredSeats) {
		return planeRepository.findFlightsWithTimezone(departureCountry,arrivalCity,departureDate,requiredSeats);
	}
	
	@Override
	public List<PlaneTimeZoneDTO> findFlightsWithTimeZone2(String departureCountry, String arrivalCity,
			LocalDate departureDate, int requiredSeats) {
		return planeRepository.findFlightsWithTimezone2(departureCountry,arrivalCity,departureDate,requiredSeats);
	}
	
	@Override
	public List<Country> searchLocations(String query) {
        return countryRepository.findByCountryStartingWithIgnoreCaseOrCityStartingWithIgnoreCase(query, query);
    }
	
	@Override
	public boolean checkLocation(String value) {
        return countryRepository.existsByCountry(value) || countryRepository.existsByCity(value);
    }
}
