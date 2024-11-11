package com.example.demo.Service;

import com.example.demo.Model.Contact;

public interface ContactService {
	
	public Contact saveContact(Contact contact);
	
	public Contact findByCId(Long cId);

}
