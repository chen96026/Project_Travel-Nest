package com.example.demo.dto;

public class ThirdPartyDTO {
	 	private String thirdPartyId;
	    private String provider;
	    private String name;
	    private String email;
	    private byte[] icon;
		public String getThirdPartyId() {
			return thirdPartyId;
		}
		public void setThirdPartyId(String thirdPartyId) {
			this.thirdPartyId = thirdPartyId;
		}
		public String getProvider() {
			return provider;
		}
		public void setProvider(String provider) {
			this.provider = provider;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public byte[] getIcon() {
			return icon;
		}
		public void setIcon(byte[] icon) {
			this.icon = icon;
		}
	    
	    
}
