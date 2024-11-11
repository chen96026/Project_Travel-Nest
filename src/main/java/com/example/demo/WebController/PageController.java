package com.example.demo.WebController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PageController {

	@RequestMapping("/register")
	public String registerpage() {
		return "new_register";
	}
	
	@RequestMapping("/login")
	public String loginpage() {
		return "new_login";
	}
	
	@RequestMapping("/memberpage")
	public String member_page() {
		return "new_memberpage";
	}
	
}
