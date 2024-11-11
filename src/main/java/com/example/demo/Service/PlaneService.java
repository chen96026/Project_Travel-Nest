package com.example.demo.Service;

import java.time.LocalDate;
import java.util.List;

import com.example.demo.CityPrice;
import com.example.demo.dto.PlaneTimeZoneDTO;
import com.example.demo.Model.Country;
import com.example.demo.Model.Plane;

public interface PlaneService {

	public List<Plane> getFlightsByCountry(String country);
	public List<Country> getCountriesByName(String countryName);
	public Plane findCheapestFlight(String countryName);
	public List<CityPrice> getCitiesAndCheapestFlights(String country);
	public List<String> findCitiesByCountry(String country);
	public Double findCheapestFlightByCity(String city);
	public List<Object[]> getMinPricesByCountry();
	public List<Plane> searchFlights(String departureCountry, String arrivalCity, LocalDate departureDate, int requiredSeats);
	public List<PlaneTimeZoneDTO> findFlightsWithTimeZone(String departureCountry, String arrivalCity, LocalDate departureDate, int requiredSeats);
	public List<PlaneTimeZoneDTO> findFlightsWithTimeZone2(String departureCountry, String arrivalCity, LocalDate departureDate, int requiredSeats);
	public List<Country> searchLocations(String query);
	public boolean checkLocation(String value);
}
