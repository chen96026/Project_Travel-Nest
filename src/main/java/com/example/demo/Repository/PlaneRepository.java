package com.example.demo.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.CityPrice;
import com.example.demo.Model.Plane;
import com.example.demo.dto.PlaneTimeZoneDTO;

public interface PlaneRepository extends JpaRepository<Plane, Long> {

	@Query("select p from Plane p where p.date_start = :date_start "
			+ "and p.date_end = :date_end and p.des_start = :des_start "
			+ "and p.des_end = :des_end and p.eco_quantity >= :eco_quantity " + "and p.bus_quantity >= :bus_quantity")
	List<Plane> search(@Param("date_start") Date date_start, @Param("date_end") Date date_end,
			@Param("des_start") String des_start, @Param("des_end") String des_end,
			@Param("eco_quantity") int eco_quantity, @Param("bus_quantity") int bus_quantity);

	@Query("select p from Plane p join Country c on p.des_end = c.airport where c.country = :country")
	List<Plane> findByCountry(@Param("country") String country);

	@Query("select p from Plane p where p.des_end in :airports")
	List<Plane> findByAirportIn(@Param("airports") List<String> airports);

	@Query("select new com.example.demo.CityPrice(c.city, min(p.eco_price)) "
			+ "from Country c join Plane p on c.airport = p.des_end " + "where c.country = :country "
			+ "group by c.city")
	List<CityPrice> findCityAndCheapestFlightByCountry(@Param("country") String country);

	@Query("select distinct c.city from Country c where c.country = :country")
	List<String> findCitiesByCountry(@Param("country") String country);

	@Query("select min(p.eco_price) from Plane p join Country c on p.des_end = c.airport where c.city = :city")
	Double findLowestPriceByCity(@Param("city") String city);

	@Query("SELECT c.country, MIN(p.eco_price) FROM Plane p " + "JOIN Country c ON p.des_end = c.airport "
			+ "GROUP BY c.country")
	List<Object[]> findMinPriceByCountry();

	@Query("SELECT p FROM Plane p " + "JOIN Country dep ON p.des_start = dep.airport "
			+ "JOIN Country arr ON p.des_end = arr.airport " + "WHERE dep.country = :departureCountry "
			+ "AND arr.city = :arrivalCity " + "AND p.date_start = :departureDate "
			+ "AND p.eco_quantity >= :requiredSeats")
	List<Plane> findFlights(@Param("departureCountry") String departureCountry,
			@Param("arrivalCity") String arrivalCity, @Param("departureDate") LocalDate departureDate,
			@Param("requiredSeats") int requiredSeats);

	@Query("SELECT new com.example.demo.dto.PlaneTimeZoneDTO(p, arr.time_zone,arr.airport_name,arr.city) " + "FROM Plane p "
			+ "JOIN Country dep ON (p.des_start = dep.airport OR p.des_start = dep.city) "
			+ "JOIN Country arr ON (p.des_end = arr.airport OR p.des_end = arr.city) "
			+ "WHERE (dep.country = :departureCountry OR dep.city = :departureCountry) "
			+ "AND (arr.country = :arrivalCity OR arr.city = :arrivalCity) " + "AND p.date_start = :departureDate "
			+ "AND p.eco_quantity >= :requiredSeats")
	List<PlaneTimeZoneDTO> findFlightsWithTimezone(@Param("departureCountry") String departureCountry,
			@Param("arrivalCity") String arrivalCity, @Param("departureDate") LocalDate departureDate,
			@Param("requiredSeats") int requiredSeats);
	
	@Query("SELECT new com.example.demo.dto.PlaneTimeZoneDTO(p, arr.time_zone,arr.airport_name,arr.city) " + "FROM Plane p "
			+ "JOIN Country dep ON (p.des_start = dep.airport OR p.des_start = dep.city) "
			+ "JOIN Country arr ON (p.des_end = arr.airport OR p.des_end = arr.city) "
			+ "WHERE (dep.country = :departureCountry OR dep.city = :departureCountry) "
			+ "AND (arr.country = :arrivalCity OR arr.city = :arrivalCity) " + "AND p.date_start = :departureDate "
			+ "AND p.bus_quantity >= :requiredSeats")
	List<PlaneTimeZoneDTO> findFlightsWithTimezone2(@Param("departureCountry") String departureCountry,
			@Param("arrivalCity") String arrivalCity, @Param("departureDate") LocalDate departureDate,
			@Param("requiredSeats") int requiredSeats);
}
