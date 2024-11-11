package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Model.Reports;

public interface ReportsRepository extends JpaRepository<Reports, Long> {
	
	public Reports findByMemberIdAndPostsId(Long userId, Long  postId);
	public List<Reports> findByPostsId(Long  postId);
	
}
