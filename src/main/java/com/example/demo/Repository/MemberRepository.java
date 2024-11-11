package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Model.Member;

public interface MemberRepository extends JpaRepository<Member, Long>{

	
	public Member findByEmail(String email);
	public Member findByUid(String uid);
	public Member findByThirdPartyId(String thirdPartyId);
}
