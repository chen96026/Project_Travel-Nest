package com.example.demo.dto;

import java.util.Base64;

import com.example.demo.Model.Member;

public class UserNameIconDTO {
	
	private String username;
	private String iconURL;
	
	public UserNameIconDTO(Member member) {
		this.username = setUsername(member);
		this.iconURL = setUserIcon(member);
	}


	public String getUsername() {
		return username;
	}

	public String getIconURL() {
		return iconURL;
	}
	
	private String setUsername(Member member) {
		if (member == null) {
			return "無此用戶";
		} else if (member.getName() == null) {
			return member.getEmail().substring(0, member.getEmail().indexOf("@"));
		} else {
			return member.getName();
		}
		
	}

	private String setUserIcon(Member member) {
		
		if (member == null || member.getIcon() == null) {
            // 如果沒有找到會員或頭像為空，返回預設圖片
            String defaultImageBase64 = "data:image/png;base64,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";
            return defaultImageBase64;
        }

        // 將圖片的二進制數據轉換為 Base64 編碼
	 	String base64Image = Base64.getEncoder().encodeToString(member.getIcon());
	    String result = "data:image/jpeg;base64," + base64Image;
	    return result;
    }
	
}
