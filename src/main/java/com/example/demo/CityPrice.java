package com.example.demo;

public class CityPrice {

	private String city;
    private Double minPrice;

    public CityPrice(String city, Double minPrice) {
        this.city = city;
        this.minPrice = minPrice;
    }

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public Double getMinPrice() {
		return minPrice;
	}

	public void setMinPrice(Double minPrice) {
		this.minPrice = minPrice;
	}
	
}
