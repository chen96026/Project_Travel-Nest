package com.example.demo.Controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;


import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/validation")
@Validated
public class ValidationController {
	
	@PostMapping("/validatePassenger")
	public ResponseEntity<Map<String, String>> validatePassenger(@RequestBody Map<String, String> passengerData){
		Map<String, String> errors = new HashMap<>();
		
		
		// 針對每個欄位單獨進行驗證，只驗證傳入的欄位
	    if (passengerData.containsKey("lastname")) {
	        String lastname = passengerData.get("lastname");
	        if (lastname == null || !lastname.matches("^[a-zA-Z\\s]+$")) {
	            errors.put("lastname", "請輸入有效的英文姓氏");
	        }
	    }

	    if (passengerData.containsKey("firstname")) {
	        String firstname = passengerData.get("firstname");
	        if (firstname == null || !firstname.matches("^[a-zA-Z\\s]+$")) {
	            errors.put("firstname", "請輸入有效的英文名字");
	        }
	    }

	    if (passengerData.containsKey("idnumber")) {
	        String idnumber = passengerData.get("idnumber");
	        System.out.println("收到的乘客數據: " + passengerData);
	        if (idnumber == null || !idnumber.matches("^[A-Za-z0-9]{6,20}$")) {
	            errors.put("idnumber", "請輸入有效的護照號碼");
	        }
	    }
	    
	    if (passengerData.containsKey("dop")&& passengerData.containsKey("date_start")) {
	    	
	    		LocalDate dopDate = LocalDate.parse(passengerData.get("dop"));
	    		LocalDate flightDate = LocalDate.parse(passengerData.get("date_start"));
	    		
	    		LocalDate sixMonthsAfterFlight = flightDate.plusMonths(6);
	    		if(dopDate.isBefore(sixMonthsAfterFlight)) {
	    			errors.put("dop" , "護照有效日期必須再出發日期後至少六個月。");
	    		}
	    }
	    
	    if (passengerData.containsKey("dob")) {
	    	String dobStr = passengerData.get("dob");
	    	try {
	    		LocalDate dob = LocalDate.parse(dobStr);
	    		LocalDate today = LocalDate.now();
	    		if (dob.isAfter(today)) {
	    			errors.put("dob", "出生日期必須是過去的日期。");
	    		}
	    	}catch(Exception e) {
	    		errors.put("dob", "請輸入有效的出生日期 (格式應為 YYYY-MM-DD)。");
	    	}
	    }
	    
	    if (errors.isEmpty()) {
	        return ResponseEntity.ok().build();
	    } else {
	        return ResponseEntity.badRequest().body(errors);
	    }
		
	}
	
	
	@PostMapping("/validateContact")	
	public ResponseEntity<Map<String, String>> validatedContact(@RequestBody Map<String, String> contactData){
		Map<String, String> errors = new HashMap<>();
		
		
		if(contactData.containsKey("contactName")) {
			String contactName = contactData.get("contactName");
			if(contactName == null || contactName.trim().isEmpty()) {
				errors.put("contactName", "聯絡人姓名為必填");
			}
		}
		
		if(contactData.containsKey("contactPhone")) {
			String contactPhone = contactData.get("contactPhone");
			if(contactPhone == null || !contactPhone.matches("^\\+?[0-9\\-]{7,15}$")) {
				errors.put("contactPhone", "請輸入有效的聯絡人電話號碼");
			}
		}
		
		if(contactData.containsKey("contactEmail")) {
			String contactEmail = contactData.get("contactEmail");
			if(contactEmail == null || !contactEmail.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
				errors.put("contactEmail", "請輸入有效的電子郵件地址");
			}
		}
		
		if(errors.isEmpty()) {
			return ResponseEntity.ok().build();
		}else {
			return ResponseEntity.badRequest().body(errors);
		}
			
	}
			
}