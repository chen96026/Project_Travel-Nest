package com.example.demo.WebController;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.Model.Member;
import com.example.demo.Repository.MemberRepository;

import jakarta.servlet.http.HttpSession;

@Controller
public class WebController {

	@Autowired
	private MemberRepository memberRepository;
	
	@GetMapping("/homepage")
	public String homepage() {
		return "new_homepage";
	}
	
	@GetMapping("/searchpage")
	public String searchpage() {
		return "new_searchpage1";
	}
	
	@GetMapping("/searchpage2")
	public String searchpage2() {
		return "new_searchpage2";
	}
	
	@GetMapping("/order/back")
	public String order_back() {
		return "/back/order_admin";
	}
	
	@GetMapping("/about")
	public String about() {
		return "about";
	}
	
	@GetMapping("/contact")
	public String contact(Model model, HttpSession session) {
		
		String getSessionUid = (String) session.getAttribute("userUid");

		if (getSessionUid != null) {
			model.addAttribute("login", true);
			
			Member member = memberRepository.findByUid(getSessionUid);
			model.addAttribute("login", true);
			model.addAttribute("email", member.getEmail());
			
		} else {
			model.addAttribute("login", false);
		}		return "contact";
	}
	
	@GetMapping("/admin")
	public String memberAdmin() {
		return "back/admin_system";
	}
}
