package com.example.demo.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.MemberStatus;
import com.example.demo.ResponseMember;
import com.example.demo.Model.Bookmark;
import com.example.demo.Model.Images;
import com.example.demo.Model.Member;
import com.example.demo.Model.Posts;
import com.example.demo.Repository.BookmarkRepository;
import com.example.demo.Repository.ImagesRepository;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.Repository.PostsRepository;
import com.example.demo.bcrypt.BCrypt;
import com.example.demo.dto.CheckPasswordDTO;
import com.example.demo.dto.PostViewDTO;
import com.example.demo.dto.UserNameIconDTO;

@Service
public class MemberServiceImpl implements MemberService {

	@Autowired
	private MemberRepository memberRepository;
	
	@Autowired
    private PostsRepository postsRepository;
	
	@Autowired
	private ImagesRepository imagesRepository;
	
	@Autowired
    private BookmarkRepository bookmarkRepository;

	@Override
	public ResponseMember isExistEmail(String email) {
		ResponseMember responseMember = new ResponseMember();
		Member member = memberRepository.findByEmail(email);
		if (member != null) {
			responseMember.setMemberStatus(MemberStatus.EXIST);
			responseMember.setMesg("信箱已被註冊");
			responseMember.setMember(member);
		} else {
			responseMember.setMemberStatus(MemberStatus.NOT_EXIST);
			responseMember.setMesg("信箱可以註冊");
			responseMember.setMember(null);
		}
		return responseMember;
	}

	@Override
	public ResponseMember registerMember(Member member) {
		ResponseMember responseMember = new ResponseMember();
		// 如果是非第三方註冊，檢查 email 和 password 是否為 null
		if (member.getProvider() == null || member.getProvider().isEmpty()) {
			if (member.getEmail() == null || member.getEmail().isEmpty()) {
				responseMember.setMemberStatus(MemberStatus.ADD_FAILURE);
				responseMember.setMesg("Email是必填的");
				return responseMember;
			}
			if (member.getPassword() == null || member.getPassword().isEmpty()) {
				responseMember.setMemberStatus(MemberStatus.ADD_FAILURE);
				responseMember.setMesg("Password是必填的");
				return responseMember;
			}
			responseMember = isExistEmail(member.getEmail());
			if (responseMember.getMemberStatus() == MemberStatus.NOT_EXIST) {
				// 生成唯一的 UID
				String uid = UUID.randomUUID().toString();
				member.setUid(uid);

				member.setPassword(BCrypt.hashpw(member.getPassword(), BCrypt.gensalt()));
			} else {
				responseMember.setMesg("Email重複");
				return responseMember;
			}
		}
		Member newMember = memberRepository.save(member);

		if (newMember.getId() != null) {
			responseMember.setMemberStatus(MemberStatus.ADD_SUCCESS);
			responseMember.setMesg("註冊成功");
			responseMember.setMember(member);
		} else {
			responseMember.setMemberStatus(MemberStatus.ADD_FAILURE);
			responseMember.setMesg("註冊失敗");
			responseMember.setMember(member);
		}

		return responseMember;
	}

	@Override
	public ResponseMember loginMember(Member member) {
		ResponseMember responseMember = isExistEmail(member.getEmail());

		if (responseMember.getMemberStatus() == MemberStatus.NOT_EXIST) {
			responseMember.setMemberStatus(MemberStatus.LOGIN_FAILURE);
			responseMember.setMesg("登入失敗");
			responseMember.setMember(member);
		} else {
			Member memberDB = responseMember.getMember();

			if (BCrypt.checkpw(member.getPassword(), memberDB.getPassword())) {
				responseMember.setMemberStatus(MemberStatus.LOGIN_SUCCESS);
				responseMember.setMesg("登入成功");
				responseMember.setMember(memberDB);
			} else {
				responseMember.setMemberStatus(MemberStatus.LOGIN_FAILURE);
				responseMember.setMesg("登入失敗");
				responseMember.setMember(null);
			}

		}
		return responseMember;
	}

	@Override
	public ResponseMember updateMember(Member member) {
		ResponseMember responseMember = new ResponseMember();

		Member memberDB = memberRepository.findByUid(member.getUid());

		if (memberDB != null) {
			
			if (member.getEmail() != null && !member.getEmail().equals(memberDB.getEmail())) {
				memberDB.setEmail(member.getEmail());
			}
			if (member.getPassword() != null && !member.getPassword().isEmpty()) {
				String hashedPassword = BCrypt.hashpw(member.getPassword(), BCrypt.gensalt());
				memberDB.setPassword(hashedPassword);
			}
			if (member.getName() != null && !member.getName().equals(memberDB.getName())) {
				memberDB.setName(member.getName());
			}
			if (member.getPhone() != null && !member.getPhone().equals(memberDB.getPhone())) {
				memberDB.setPhone(member.getPhone());
			}
			if (member.getBirthday() != null && !member.getBirthday().equals(memberDB.getBirthday())) {
				memberDB.setBirthday(member.getBirthday());
			}

			memberRepository.save(memberDB);

			responseMember.setMemberStatus(MemberStatus.UPDATE_SUCCESS);
			responseMember.setMesg("資料更新成功");
			responseMember.setMember(memberDB);
		} else {
			responseMember.setMemberStatus(MemberStatus.UPDATE_FAILURE);
			responseMember.setMesg("找不到會員");
			responseMember.setMember(null);
		}
		return responseMember;
	}
	
	@Override
	public String updatePassword(CheckPasswordDTO checkPasswordDTO) {
		Member member = memberRepository.findByUid(checkPasswordDTO.getUid());
		if (member.getPassword() != null && BCrypt.checkpw(checkPasswordDTO.getOld_password(), member.getPassword())) {
			member.setPassword(BCrypt.hashpw(checkPasswordDTO.getPassword(),BCrypt.gensalt()));
			memberRepository.save(member);
		}else {
			return "舊密碼不符";
		}
		return null;
	}

	@Override
	public Member findMemberuid(String uid) {
		Member member = memberRepository.findByUid(uid);
		if (member != null) {
			return member;
		} else {
			return null;
		}
	}

	@Override
	public void uploadMembericon(String uid, MultipartFile file) throws Exception {
		Member member = memberRepository.findByUid(uid);

		if (member == null) {
			throw new RuntimeException("用戶未找到");
		}

		// 將圖片文件的二進制數據儲存到 icon 欄位
		member.setIcon(file.getBytes());
		memberRepository.save(member);

		System.out.println("會員 " + member.getUid() + " 的頭像已更新");
	}

	@Override
	public boolean deleteAccount(String uid) {
		Member member = memberRepository.findByUid(uid);
		memberRepository.delete(member);
		return true;
	}
	
	@Override
	public Member findByThirdPartyId(String thirdPartyId) {
		// 查詢是否有thirdPartyId的會員
		 return memberRepository.findByThirdPartyId(thirdPartyId);
	}

	@Override
	public ResponseMember thirdPartyLogin(String thirdPartyId, String provider, String name, String email,
			byte[] icon) {
		 Member existingMember = memberRepository.findByThirdPartyId(thirdPartyId);
		 ResponseMember responseMember = new ResponseMember();
		  if (existingMember != null) {
		        
		        responseMember.setMemberStatus(MemberStatus.LOGIN_SUCCESS);
		        responseMember.setMesg("登入成功");
		        responseMember.setMember(existingMember);
		        return responseMember;
		    }
		 
	
		    Member newMember = new Member();
		    newMember.setThirdPartyId(thirdPartyId);  
		    newMember.setProvider(provider);          
		    newMember.setName(name);           		  
		    newMember.setEmail(email);                
		    newMember.setIcon(icon);                 
		    
		    // 生成唯一的 UID
		    String uid = UUID.randomUUID().toString();
		    // 為第三方用戶設置 UID
		    newMember.setUid(uid);
		 
		   
		    ResponseMember registerResponse = registerMember(newMember);
		    
		    return registerResponse; 
	}
	
	//會員自己的貼文
	@Override
	public List<PostViewDTO> getMemberPosts(String uid) {
		Member member = memberRepository.findByUid(uid);
		if(member==null) {
			throw new RuntimeException ("會員不存在");
		}
		
        List<Posts> posts = postsRepository.findByAuthor(member);
        List<PostViewDTO> postViewDTOList = new ArrayList<>();
        
     // 將每個貼文轉換為PostViewDTO
        for (Posts post : posts) {
            
            Images coverImage = imagesRepository.findFirstByPosts(post);
            String coverImgURL = coverImage != null ? coverImage.getImage() : null;

            
            List<Images> images = imagesRepository.findByPosts(post);
            List<String> imageURLs = new ArrayList<>();
            for (Images image : images) {
                imageURLs.add(image.getImage());
            }

            // 使用UserNameIconDTO來封裝會員的名稱和頭像
            UserNameIconDTO userNameIconDTO = new UserNameIconDTO(member);

            // 創建PostViewDTO封裝
            PostViewDTO postViewDTO = new PostViewDTO(
                post,
                coverImgURL,                 
                post.getCreatedTime().toLocalDate(),   
                userNameIconDTO,            
                post.getLikesCount(),   
                post.getReportsCount()
            );

            postViewDTOList.add(postViewDTO);
        }

        return postViewDTOList; 
    }
	
	//收藏的貼文
		@Override
		public List<PostViewDTO> getMemberFavorites(String uid) {
			
	        Member member = memberRepository.findByUid(uid);
	        if (member == null) {
	            throw new RuntimeException("會員不存在");
	        }

	       
	        List<Bookmark> bookmarks = bookmarkRepository.findByMember(member);

	        // 將收藏的貼文轉換為 PostViewDTO
	        return bookmarks.stream()
	            .map(bookmark -> {
	                Posts post = bookmark.getPosts();
	                
	               
	                Images coverImage = imagesRepository.findFirstByPosts(post);
	                String coverImgURL = coverImage.getImage();

	            
	                UserNameIconDTO userNameIconDTO = new UserNameIconDTO(post.getAuthor());

	                return new PostViewDTO(
	                    post, 
	                    coverImgURL, 
	                    post.getCreatedTime().toLocalDate(), 
	                    userNameIconDTO, 
	                    post.getLikesCount(), 
	                    post.getReportsCount()
	                );
	            })
	            .collect(Collectors.toList());
	    }

	//後台會員
	@Override
	public List<Member> findallmember() {
		 return memberRepository.findAll();
	}	
}
