package com.example.demo.dto;

import com.example.demo.Model.Plane;

public class PlaneTimeZoneDTO {

	private Plane plane;
	private String time_zone;
	private String airport_name;
	private String city;

	public PlaneTimeZoneDTO(Plane plane, String time_zone,String airport_name,String city) {
		this.plane = plane;
		this.time_zone = time_zone; 
		this.airport_name = airport_name;
		this.city = city;
	}

	public Plane getPlane() {
		return plane;
	}

	public void setPlane(Plane plane) {
		this.plane = plane;
	}

	public String getTime_zone() {
		return time_zone;
	}

	public void setTime_zone(String time_zone) {
		this.time_zone = time_zone;
	}

	public String getAirport_name() {
		return airport_name;
	}

	public void setAirport_name(String airport_name) {
		this.airport_name = airport_name;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}
}
