package com.example.demo.Controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.MemberStatus;
import com.example.demo.ResponseMember;
import com.example.demo.Model.Member;
import com.example.demo.Model.Posts;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.Service.MemberService;
import com.example.demo.dto.CheckPasswordDTO;
import com.example.demo.dto.PostViewDTO;
import com.example.demo.dto.ThirdPartyDTO;

import jakarta.servlet.http.HttpSession;

@RequestMapping("/member")
@RestController
public class MemberController {

	@Autowired
	private MemberService memberService;

	@Autowired
	private MemberRepository memberRepository;

	@GetMapping("/isexistEmail/{email}")
	public ResponseMember isExistEmail(@PathVariable("email") String email) {
		return memberService.isExistEmail(email);
	}

	@PostMapping("/register")
	public ResponseMember register(@RequestBody Member member, HttpSession session) {
		ResponseMember responseMember = memberService.registerMember(member);
		if (responseMember.getMemberStatus() == MemberStatus.ADD_SUCCESS) {
			session.setAttribute("userEmail", responseMember.getMember().getEmail());
			session.setAttribute("userUid", responseMember.getMember().getUid());
		}
		return responseMember;
	}

	@PostMapping("/login")
	public ResponseMember login(@RequestBody Member member, HttpSession session) {
		ResponseMember responsemember = memberService.loginMember(member);
		if (responsemember.getMemberStatus() == MemberStatus.LOGIN_SUCCESS) {
			session.setAttribute("userId", responsemember.getMember().getId());
			session.setAttribute("userEmail", responsemember.getMember().getEmail());
			session.setAttribute("userName", responsemember.getMember().getName());
			session.setAttribute("userPhone", responsemember.getMember().getPhone());
			session.setAttribute("userBirth", responsemember.getMember().getBirthday());
			session.setAttribute("userUid", responsemember.getMember().getUid());
		}
		return responsemember;
	}

	@GetMapping("/info")
	public Member getMemberInfo(HttpSession session) {
		String userUid = (String) session.getAttribute("userUid");
		if (userUid != null) {
			Member member = memberService.findMemberuid(userUid);
			System.out.println("返回的會員資料: " + member);
			return member;
		}
		return null;
	}

	@PutMapping("/update")
	public ResponseMember update(@RequestBody Member member) {
		return memberService.updateMember(member);
	}

	@PutMapping("/updatepassword")
	public String updatepassword(@RequestBody CheckPasswordDTO checkPasswordDTO) {
		return memberService.updatePassword(checkPasswordDTO);
	}

	@PostMapping("/uploadicon")
	public ResponseEntity<String> uploadIcon(@RequestParam("avatar") MultipartFile file,
			@RequestParam("uid") String uid) {
		if (file.isEmpty()) {
			return ResponseEntity.badRequest().body("圖片文件為空");
		}

		// 檢查文件類型，只允許 JPEG 和 PNG
		String fileType = file.getContentType();
		if (!fileType.equals("image/jpeg") && !fileType.equals("image/png")) {
			return ResponseEntity.badRequest().body("文件格式不支援，只支援 JPEG 和 PNG 格式");
		}

		try {
			// 調用服務層來處理圖片上傳邏輯
			memberService.uploadMembericon(uid, file);
			return ResponseEntity.ok("頭像上傳成功");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("圖片上傳失敗");
		}
	}

	@DeleteMapping("/delete")
	public String delete(@RequestBody Member member) {
		memberService.deleteAccount(member.getUid());
		return null;
	}

	@PostMapping("/thirdparty/login")
	public ResponseEntity<ResponseMember> thirdPartyLogin(@RequestBody ThirdPartyDTO thirdPartuDTO,
			HttpSession session) {

		// 從 ThirdPartyLoginRequest 中提取數據
		String thirdPartyId = thirdPartuDTO.getThirdPartyId();
		String provider = thirdPartuDTO.getProvider();
		String name = thirdPartuDTO.getName();
		String email = thirdPartuDTO.getEmail(); // 允許為 null
		byte[] icon = thirdPartuDTO.getIcon(); // 允許為 null

		// 調用 Service 處理邏輯
		ResponseMember responseMember = memberService.thirdPartyLogin(thirdPartyId, provider, name, email, icon);

		// 如果登入成功，存入session
		if (responseMember.getMemberStatus() == MemberStatus.LOGIN_SUCCESS
				|| responseMember.getMemberStatus() == MemberStatus.ADD_SUCCESS) {
			session.setAttribute("userEmail", responseMember.getMember().getEmail());
			session.setAttribute("userUid", responseMember.getMember().getUid());
		}


		return ResponseEntity.ok(responseMember);
	}

	// 登出
	@GetMapping("/logout")
	public String logout(HttpSession session) {
		System.out.println(session);
		session.invalidate();
		return null;
	}

	// 後臺會員新增API
	@GetMapping("/member_admin")
	public ResponseEntity<List<Member>> getallmember() {
		List<Member> members = memberService.findallmember();
		if (members.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(members);// 有資料就回傳200
	}

	@PostMapping("/findOrders")
	public List<String> findOrders(@RequestParam String uid) {
		Member member = memberRepository.findByUid(uid);

		if (member == null || member.getOrders() == null) {
			return new ArrayList<>(); // 返回空列表
		}

		String[] items = member.getOrders().split(",");
		List<String> list = new ArrayList<>(Arrays.asList(items));
		System.out.println(list);
		return list;
	}

	@GetMapping("/myposts")
	public List<PostViewDTO> getMemberPosts(@RequestParam String uid) {
		return memberService.getMemberPosts(uid);
	}

	@GetMapping("/myfavorites")
	public List<PostViewDTO> getMemberFavorites(@RequestParam String uid) {
		return memberService.getMemberFavorites(uid);
	}
}
