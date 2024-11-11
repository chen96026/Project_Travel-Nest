package com.example.demo.Controller;

import java.net.http.HttpHeaders;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.CityPrice;
import com.example.demo.dto.PlaneTimeZoneDTO;

import jakarta.servlet.http.HttpSession;

import com.example.demo.Model.Country;
import com.example.demo.Model.Orders;
import com.example.demo.Model.Plane;
import com.example.demo.Repository.CountryRepository;
import com.example.demo.Repository.OrdersRepository;
import com.example.demo.Repository.PlaneRepository;
import com.example.demo.Service.OrdersServiceImpl;
import com.example.demo.Service.PlaneService;

@RequestMapping("/plane")
@RestController
public class PlaneController {

	@Autowired
	private PlaneRepository planeRepository;

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private PlaneService planeService;

	@Autowired
	private OrdersServiceImpl ordersServiceImpl;

	@Autowired
	private OrdersRepository ordersRepository;

	@PostMapping("/check_country")
	public List<Country> searchCountries(@RequestBody Country country) {
		return (List<Country>) countryRepository.findByCountry(country.getCountry());
	}

	@PostMapping("/cheapest_by_city")
	public List<CityPrice> getCheapestFlightsByCity(@RequestBody Map<String, String> requestData) {
		String country = requestData.get("country");
		if (country == null || country.isEmpty()) {
			throw new IllegalArgumentException("Country parameter is missing.");
		}
		return planeService.getCitiesAndCheapestFlights(country);
	}

	@GetMapping("/min_prices")
	public List<Object[]> getMinPricesByCountry() {
		return planeService.getMinPricesByCountry();
	}

	@GetMapping("/search")
	public List<Plane> searchFlights(@RequestParam String departureCountry, @RequestParam String arrivalCity,
			@RequestParam String departureDate, @RequestParam int requiredSeats) {
		LocalDate date = LocalDate.parse(departureDate); // Convert string to LocalDate
		return planeService.searchFlights(departureCountry, arrivalCity, date, requiredSeats);
	}

	@GetMapping("/search2")
	public List<PlaneTimeZoneDTO> searchFlights2(@RequestParam String departureCountry,
			@RequestParam String arrivalCity, @RequestParam String departureDate, @RequestParam int requiredSeats) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
		LocalDate date = LocalDate.parse(departureDate, formatter);
		return planeService.findFlightsWithTimeZone(departureCountry, arrivalCity, date, requiredSeats);
	}

	@GetMapping("/search2ByBusiness")
	public List<PlaneTimeZoneDTO> searchFlights3(@RequestParam String departureCountry,
			@RequestParam String arrivalCity, @RequestParam String departureDate, @RequestParam int requiredSeats) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
		LocalDate date = LocalDate.parse(departureDate, formatter);
		return planeService.findFlightsWithTimeZone2(departureCountry, arrivalCity, date, requiredSeats);
	}

	@GetMapping("/inputSearch")
	public List<Country> searchLocations(@RequestParam("query") String query) {
		return planeService.searchLocations(query);
	}

	@GetMapping("/orderForMember")
	public Orders orderForMember2(@RequestParam String orderNumber) {
		Orders order = ordersRepository.findByOrderNumber(orderNumber);
		return order;
	}

	@GetMapping("/checkLocation")
	public ResponseEntity<Map<String, Boolean>> checkLocation(@RequestParam String value) {
		boolean exists = planeService.checkLocation(value);
		Map<String, Boolean> response = new HashMap<>();
		response.put("exists", exists);
		return ResponseEntity.ok(response);
	}

}
