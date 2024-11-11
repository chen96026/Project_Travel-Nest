package com.example.demo.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Support;
import com.example.demo.Service.SupportService;

import jakarta.mail.MessagingException;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;


@RequestMapping("/contact/api")
@RestController
public class SupportAPIController {
	
	@Autowired
	private SupportService supportService;
	
	@PostMapping("/submit")
	public Support newContact(
			@RequestParam String name,
			@RequestParam String email,
			@RequestParam(required = false) String phone,
			@RequestParam(required = false) Long orderId,
			@RequestParam String category,
			@RequestParam String content) throws MessagingException, IOException {
		
		Support support = new Support();
		
		support.setName(name);
		support.setEmail(email);
		support.setPhone(phone);
		support.setOrderId(orderId);
		support.setCategory(category);
		support.setContent(content);
		support.setSubmissionTime(LocalDateTime.now());
		
		return supportService.newSupport(support);
	}
	
}
