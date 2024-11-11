package com.example.demo;

import java.sql.Date;
import java.sql.Time;

public class SelectedData {

	private String airline;
	private Date date_start;
	private Date date_end;
	private String des_start;
	private String des_end;
	private Time time_start;
	private Time time_end;
	private double bus_price;
	private double eco_price;
	private int time_zone;

	public SelectedData(String airline, Date date_start, Date date_end, String des_start, String des_end,
			Time time_start, Time time_end, double bus_price, double eco_price, int time_zone) {
		this.airline = airline;
		this.date_start = date_start;
		this.date_end = date_end;
		this.des_start = des_start;
		this.des_end = des_end;
		this.time_start = time_start;
		this.time_end = time_end;
		this.bus_price = bus_price;
		this.eco_price = eco_price;
		this.time_zone = time_zone;
	}

	public String getAirline() {
		return airline;
	}

	public void setAirline(String airline) {
		this.airline = airline;
	}

	public Date getDate_start() {
		return date_start;
	}

	public void setDate_start(Date date_start) {
		this.date_start = date_start;
	}

	public Date getDate_end() {
		return date_end;
	}

	public void setDate_end(Date date_end) {
		this.date_end = date_end;
	}

	public String getDes_start() {
		return des_start;
	}

	public void setDes_start(String des_start) {
		this.des_start = des_start;
	}

	public String getDes_end() {
		return des_end;
	}

	public void setDes_end(String des_end) {
		this.des_end = des_end;
	}

	public Time getTime_start() {
		return time_start;
	}

	public void setTime_start(Time time_start) {
		this.time_start = time_start;
	}

	public Time getTime_end() {
		return time_end;
	}

	public void setTime_end(Time time_end) {
		this.time_end = time_end;
	}

	public double getBus_price() {
		return bus_price;
	}

	public void setBus_price(double bus_price) {
		this.bus_price = bus_price;
	}

	public double getEco_price() {
		return eco_price;
	}

	public void setEco_price(double eco_price) {
		this.eco_price = eco_price;
	}

	public int getTime_zone() {
		return time_zone;
	}

	public void setTime_zone(int time_zone) {
		this.time_zone = time_zone;
	}
}
