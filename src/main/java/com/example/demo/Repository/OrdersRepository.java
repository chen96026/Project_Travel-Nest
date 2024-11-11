package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.Model.Orders;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, Long>{
	@Query(value = "SELECT o.order_number, c.contactName, o.finalprice, o.createDate, o.orderStatus " +
		            "FROM order_information o " +
		            "JOIN contact_information c ON o.contact_id = c.CId", 
            nativeQuery = true)
	List<Object[]> findOrdersWithContactName();
	
	Orders findByOrderNumber(String orderNumber);
	
	@Query("SELECT o FROM Orders o WHERE o.orderNumber LIKE %:orderNumber%")
	List<Orders> findByOrderNumberContain(@Param("orderNumber") String orderNumber);
}