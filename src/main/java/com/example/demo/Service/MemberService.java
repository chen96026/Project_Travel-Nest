package com.example.demo.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.ResponseMember;
import com.example.demo.Model.Member;
import com.example.demo.dto.CheckPasswordDTO;
import com.example.demo.dto.PostViewDTO;

@Service
public interface MemberService {

	// 檢查
	public ResponseMember isExistEmail(String email);

	// 註冊
	public ResponseMember registerMember(Member member);

	// 登錄
	public ResponseMember loginMember(Member member);

	// uid查詢會員資料
	public Member findMemberuid(String uid);

	// 更新帳戶資料
	public ResponseMember updateMember(Member member);

	// 更新密碼
	public String updatePassword(CheckPasswordDTO checkPasswordDTO);

	// 上傳頭像
	public void uploadMembericon(String uid, MultipartFile file) throws Exception;

	// 刪除
	public boolean deleteAccount(String uid);

	// 第三方平台提供的uid查詢member
	public Member findByThirdPartyId(String thirdPartyId);

	// 第三方登入
	public ResponseMember thirdPartyLogin(String thirdPartyId, String provider, String name, String email, byte[] icon);

	// 後臺會員新增API
	public List<Member> findallmember();
	
	// 自己的貼文
	List<PostViewDTO> getMemberPosts(String uid);
	
	// 收藏的貼文
	List<PostViewDTO> getMemberFavorites(String uid);
}
