package com.example.demo.Model;

import java.util.Date;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Past;

import java.util.List;

@Entity
@Table(name = "passenger_information")
public class Passenger {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "Pid")
	private Long pid;
	
	@Column(name = "LastName")
	@NotEmpty(message = "姓氏為必填項")
	private String lastName;
	
	@Column(name = "FirstName")
	@NotEmpty(message = "名字為必填項")
	private String firstName;
	
	@Column(name = "Gender")
	@NotEmpty(message = "性別為必選項")
	private String gender;
	
	@Column(name = "Birthday")
	@Past(message = "出生日期必須是過去的日期")
	private Date birthday;
	
	@Column(name = "IdType")
	private String idType;
	
	@Column(name = "IdNumber")
	private String idNumber;
	
	@Column(name = "Country")
	@NotEmpty(message = "國籍為必選項")
	private String country;
	
	@Column(name = "idDate")
	private Date idDate;
	
	@Column(name = "Contact_Id")
	private Long contactId;
	
	@ManyToOne
	@JoinColumn(name = "Order_Id",referencedColumnName = "Oid")
	private Orders orders;
	
	@ManyToOne
    @JoinColumn(name = "Contact_Id", referencedColumnName = "CId", insertable = false, updatable = false)
    private Contact contact;
	
	@OneToMany(mappedBy = "passenger",cascade = CascadeType.ALL)
	private List<Luggage> luggageList;
	
	
	public List<Luggage> getLuggageList() {
		return luggageList;
	}

	public void setLuggageList(List<Luggage> luggageList) {
		this.luggageList = luggageList;
	}

	public Date getIdDate() {
		return idDate;
	}

	public void setIdDate(Date idDate) {
		this.idDate = idDate;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public String getIdType() {
		return idType;
	}

	public void setIdType(String idType) {
		this.idType = idType;
	}

	public String getIdNumber() {
		return idNumber;
	}

	public void setIdNumber(String idNumber) {
		this.idNumber = idNumber;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}


	public Long getContactId() {
		return contactId;
	}

	public void setContactId(Long contactId) {
		this.contactId = contactId;
	}

	public Orders getOrders() {
		return orders;
	}

	public void setOrders(Orders orders) {
		this.orders = orders;
	}

	public Contact getContact() {
		return contact;
	}

	public void setContact(Contact contact) {
		this.contact = contact;
	}

	
}
