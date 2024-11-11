package com.example.demo.Model;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_information")
public class Orders {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "Oid")
	private Long oid;

	@Column(name = "order_number")
	private String orderNumber;
	
	@Column(name = "contact_id", nullable = false)
    private Long contactId; // 儲存聯絡人的 CId

	@OneToMany(mappedBy = "orders", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<Passenger> passengerList = new ArrayList<>();
	
	@Column(name = "finalprice")
	private Double finalPrice;
	
	@Column(name = "createDate")
	private LocalDateTime createDate;
	
	@Column(name= "start_data")
    private String start_data;
	
	@Column(name= "end_data")
	private String end_data;
	
	public Contact getContactInformation() {
		return contactInformation;
	}

	public void setContactInformation(Contact contactInformation) {
		this.contactInformation = contactInformation;
	}
	
	@Enumerated(EnumType.STRING)
	@Column(name = "orderStatus", nullable = false)
	private OrderStatus orderStatus;
	
	public OrderStatus getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(OrderStatus orderStatus) {
		this.orderStatus = orderStatus;
	}

	public enum OrderStatus {
	    尚未付款,
	    逾期付款已取消,
	    已付款完成,
	    已完成飛行
	}



	// 關聯到 ContactInformation
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "contact_id", referencedColumnName = "CId", insertable = false, updatable = false)
    private Contact contactInformation;  // 關聯的聯絡人資訊
	
	public LocalDateTime getCreateDate() {
		return createDate;
	}

	public void setCreateDate(LocalDateTime createDate) {
		this.createDate = createDate;
	}

	public void setFinalPrice(Double finalPrice) {
		this.finalPrice = finalPrice;
	}

	public Long getOid() {
		return oid;
	}

	public List<Passenger> getPassengerList() {
		return passengerList;
	}

	public Long getContactId() {
		return contactId;
	}

	public void setContactId(Long contactId) {
		this.contactId = contactId;
	}

	public void setPassengerList(List<Passenger> passengerList) {
		this.passengerList = passengerList;
	}

	public void setOid(Long oid) {
		this.oid = oid;
	}

	public String getOrderNumber() {
		return orderNumber;
	}

	public Double getFinalPrice() {
		return finalPrice;
	}

	public void setFinalprice(Double finalPrice) {
		this.finalPrice = finalPrice;
	}

	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}

	public String getStart_data() {
		return start_data;
	}

	public void setStart_data(String start_data) {
		this.start_data = start_data;
	}

	public String getEnd_data() {
		return end_data;
	}

	public void setEnd_data(String end_data) {
		this.end_data = end_data;
	}



	public static class PassengerOrderRequest {
        private List<Passenger> passengers;
        private Long orderId;
        
        
        public List<Passenger> getPassengers() {
            return passengers;
        }

        public void setPassengers(List<Passenger> passengers) {
            this.passengers = passengers;
        }

		public Long getOrderId() {
			return orderId;
		}

		public void setOrderId(Long orderId) {
			this.orderId = orderId;
		}
	}
}