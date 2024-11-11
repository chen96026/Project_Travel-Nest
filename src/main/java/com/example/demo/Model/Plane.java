package com.example.demo.Model;

import java.sql.Date;
import java.sql.Time;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "flight")
public class Plane {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "airline")
	private String airline;

	@Column(name = "type")
	private String type;

	@Column(name = "date_start")
	private Date date_start;

	@Column(name = "date_end")
	private Date date_end;

	@Column(name = "des_start")
	private String des_start;

	@Column(name = "des_end")
	private String des_end;

	@Column(name = "time_start")
	private Time time_start;

	@Column(name = "time_end")
	private Time time_end;

	@Column(name = "bus_price")
	private double bus_price;

	@Column(name = "eco_price")
	private double eco_price;

	@Column(name = "eco_quantity")
	private int eco_quantity;

	@Column(name = "bus_quantity")
	private int bus_quantity;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public int getEco_quantity() {
		return eco_quantity;
	}

	public void setEco_quantity(int eco_quantity) {
		this.eco_quantity = eco_quantity;
	}

	public int getBus_quantity() {
		return bus_quantity;
	}

	public void setBus_quantity(int bus_quantity) {
		this.bus_quantity = bus_quantity;
	}

	public String getAirline() {
		return airline;
	}

	public void setAirline(String airline) {
		this.airline = airline;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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
}
