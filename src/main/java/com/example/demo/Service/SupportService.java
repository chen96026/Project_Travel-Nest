package com.example.demo.Service;

import java.io.IOException;

import com.example.demo.Model.Support;

import jakarta.mail.MessagingException;

public interface SupportService {
	
	public Support newSupport(Support support) throws MessagingException, IOException;
	
}
