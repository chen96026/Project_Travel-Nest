package com.example.demo;

import com.example.demo.Model.Member;

public class ResponseMember {
	
	private MemberStatus memberStatus;
	private String mesg;
	private Member member;
	
	public MemberStatus getMemberStatus() {
		return memberStatus;
	}
	public void setMemberStatus(MemberStatus memberStatus) {
		this.memberStatus = memberStatus;
	}
	public String getMesg() {
		return mesg;
	}
	public void setMesg(String mesg) {
		this.mesg = mesg;
	}
	public Member getMember() {
		return member;
	}
	public void setMember(Member member) {
		this.member = member;
	}
}
