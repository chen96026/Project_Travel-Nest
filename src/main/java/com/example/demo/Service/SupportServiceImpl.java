package com.example.demo.Service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.Support;
import com.example.demo.Repository.SupportRepository;

import jakarta.mail.MessagingException;

@Service
public class SupportServiceImpl implements SupportService {
	
	@Autowired
	private SupportRepository supportRepository;
	
	@Autowired
	private MailService mailService;
	

	@Override
	public Support newSupport(Support support) throws MessagingException, IOException {
		
		Support newSupport = supportRepository.save(support);
		mailService.sendSupportMail(newSupport);
		
		return newSupport;
	}
	
}
