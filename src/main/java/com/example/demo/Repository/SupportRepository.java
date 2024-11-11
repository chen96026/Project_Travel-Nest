package com.example.demo.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Model.Support;

public interface SupportRepository extends JpaRepository<Support, Long> {
	
	public Page<Support> findByStatus(Support.ContactStatus status, Pageable pageable);

}
