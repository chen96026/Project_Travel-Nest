package com.example.demo.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "luggage")
public class Luggage {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "LId")
	private long lid;
	
	@Enumerated(EnumType.STRING) 
    @Column(name = "TripType") 
    private TripType tripType;
	
	@ManyToOne
	@JoinColumn(name = "PassengerId", referencedColumnName = "Pid", nullable = false)
	private Passenger passenger;

	
	@ManyToOne
	@JoinColumn(name = "OrderId", referencedColumnName = "Oid")
	private Orders orders;
	
	
	public Orders getOrders() {
		return orders;
	}


	public void setOrders(Orders orders) {
		this.orders = orders;
	}


	public enum TripType {
	    OUTBOUND,
	    RETURN
	}
	
	@Column(name = "AdditionalLuggage")
	private String addLuggage;
	
	
	@Column(name = "LgPrice")
	private Double lgprice;


	public long getLid() {
		return lid;
	}


	public void setLid(long lid) {
		this.lid = lid;
	}


	public Passenger getPassenger() {
		return passenger;
	}


	public void setPassenger(Passenger passenger) {
		this.passenger = passenger;
	}


	public TripType getTripType() {
		return tripType;
	}


	public void setTripType(TripType tripType) {
		this.tripType = tripType;
	}


	public String getAddLuggage() {
		return addLuggage;
	}


	public void setAddLuggage(String addLuggage) {
		this.addLuggage = addLuggage;
	}


	public Double getLgprice() {
		return lgprice;
	}


	public void setLgprice(Double lgprice) {
		this.lgprice = lgprice;
	}
	
		
	
	
}

