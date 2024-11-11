package com.example.demo.Service;

import java.io.IOException;

import com.example.demo.Model.Support;

import jakarta.mail.MessagingException;

public interface MailService {
	
	public void sendSupportMail(Support contact) throws MessagingException, IOException;

}
