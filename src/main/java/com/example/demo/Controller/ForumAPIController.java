package com.example.demo.Controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

import jakarta.servlet.http.HttpSession;
import com.example.demo.Model.Bookmark;
import com.example.demo.Model.Images;
import com.example.demo.Model.Likes;
import com.example.demo.Model.Member;
import com.example.demo.dto.PostViewDTO;
import com.example.demo.Model.Posts;
import com.example.demo.dto.PostsViewGetPagesDTO;
import com.example.demo.Model.Reports;
import com.example.demo.Repository.ImagesRepository;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.Repository.PostsRepository;
import com.example.demo.Service.BookmarkService;
import com.example.demo.Service.ImagesService;
import com.example.demo.Service.LikesService;
import com.example.demo.Service.PostsService;
import com.example.demo.Service.ReportsService;

@RequestMapping("/forum/api")
@RestController
public class ForumAPIController {

	@Autowired
	private PostsService postsService;
	
	@Autowired
	private PostsRepository postsRepository;
	
	@Autowired
	private ImagesService imagesService;
	
	@Autowired
	private ImagesRepository imagesRepository;
	
	@Autowired
	private LikesService likesService;
	
	@Autowired
	private BookmarkService bookmarkService;
	
	@Autowired
	private ReportsService reportsService;
	
	@Autowired
	private MemberRepository memberRepository;

	
	@GetMapping("/getHomePagePosts")
	public List<PostViewDTO> getHomePagePosts() {
		
		List<Posts> postlist = new ArrayList<Posts>();
		
		Sort sort = postsService.setSort("postDate");
		Pageable pageable = PageRequest.of(0, 6, sort);
		postlist = postsRepository.findByStatusEquals(2, pageable).getContent();	// 經審核完成可刊登於首頁的文章(依PO文日最新的6則)
		
		List<PostViewDTO> posts = postsService.getPosts(postlist);
		
		return posts;
	}
	
	@GetMapping("/loadCards")
	public List<PostViewDTO> loadCards(
			@RequestParam(required = false) String country,
			@RequestParam(required = false) String city,
			@RequestParam(required = false) String key,
			@RequestParam(defaultValue = "postDate") String sortBy,
			@RequestParam(defaultValue = "0") int page) {
		
		List<Posts> postlist = new ArrayList<Posts>();
		
		if ("likes".equals(sortBy)) {
			postlist = postsService.findPostsSortedByLikes(country, city, key, page).getContent();
		} else {
			Sort sort = postsService.setSort(sortBy);
			postlist = postsService.findPosts(country, city, key, sort, page).getContent();	// 關鍵字篩選
		}
		
		List<PostViewDTO> posts = postsService.getPosts(postlist);
		
		return posts;
	}
	
	@PostMapping("/editPost")
	public Posts newPost (
			@RequestParam String country,
			@RequestParam String city,
			@RequestParam(required = false) LocalDate startDate,
			@RequestParam(required = false) LocalDate endDate,
			@RequestParam String mainTitle,
			@RequestParam String subTitle,
			@RequestParam String tags,
			@RequestParam Integer rate,
			@RequestParam(required = false) Boolean share,
			@RequestParam String content,
			@RequestParam List<String> images,
			HttpSession session) {
		
		Posts post = new Posts();
		post.setCountry(country);
		post.setCity(city);
		post.setStartDate(startDate);
		post.setEndDate(endDate);
		post.setMainTitle(mainTitle);
		post.setSubTitle(subTitle);
		post.setTags(tags);
		post.setRate(rate);
		post.setContent(content);
		post.setCreatedTime(LocalDateTime.now());
		System.out.println("post1");
		
		if (share != null) {
			post.setShare(share);			
		} else {
			post.setShare(false);
		}
		
		String getSessionUid = (String) session.getAttribute("userUid");
		Member author = memberRepository.findByUid(getSessionUid);
		System.err.println(author);
		post.setAuthor(author);
		
		try {
			return postsService.newPost(post, images);
		} catch (Exception e) {
			return null;
		}			
	}
	
	@PutMapping("/editPost")
	public Posts update (
			@RequestParam Long id,
			@RequestParam String country,
			@RequestParam String city,
			@RequestParam(required = false) LocalDate startDate,
			@RequestParam(required = false) LocalDate endDate,
			@RequestParam String mainTitle,
			@RequestParam String subTitle,
			@RequestParam String tags,
			@RequestParam Integer rate,
			@RequestParam(required = false) Boolean share,
			@RequestParam String content,
			@RequestParam(required = false) List<String> images) {
		System.out.println("Update1");
		Posts post = new Posts();
		post.setId(id);
		post.setCountry(country);
		post.setCity(city);
		post.setStartDate(startDate);
		post.setEndDate(endDate);
		post.setMainTitle(mainTitle);
		post.setSubTitle(subTitle);
		post.setTags(tags);
		post.setRate(rate);
		post.setContent(content); 
		
		if (share != null) {
			post.setShare(share);			
		} else {
			post.setShare(false);
		}
		
		Posts updatePosts = new Posts();
		
		try {
			updatePosts = postsService.updatePost(post, images);
			System.out.println("updateOK");
			return updatePosts;
		} catch (Exception e) {
			System.err.println(e);
			return null;
		}			
	}

	@GetMapping("/getImg")
	public List<Images> getImg(@RequestParam Long id) {
		
		Posts post = postsRepository.findById(id).orElse(null);
		
		List<Images> imageList = imagesRepository.findByPosts(post);
		
		return imageList;
	}
	
	@DeleteMapping("/deleteImg")
	public ResponseEntity<Void> deleteImg(@RequestBody List<Long> imageIds) {
		System.out.println(imageIds);
		for (Long imageId : imageIds) {
			imagesService.deleteImgById(imageId);
		}
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/like/{id}")
	public Likes addLike(@PathVariable Long id, HttpSession session) {
		
		String getSessionUid = (String) session.getAttribute("userUid");
		Member member = memberRepository.findByUid(getSessionUid);
		
		return likesService.addLike(member.getId(), id);
	}
	
	@DeleteMapping("/like/{id}")
	public ResponseEntity<Void> deleteLike(@PathVariable Long id, HttpSession session) {
		
		String getSessionUid = (String) session.getAttribute("userUid");
		Member member = memberRepository.findByUid(getSessionUid);
		likesService.deleteLike(member.getId(), id);
		
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping("/countLikes/{id}")
	public Long countLikes(@PathVariable Long id) {
		
		System.out.println("count");
		Posts post = postsRepository.findById(id).orElse(null);
		
		return post.getLikesCount();
	}
	
	@PostMapping("/bookmark/{id}")
	public Bookmark addBookmark(@PathVariable Long id, HttpSession session) {
		
		String getSessionUid = (String) session.getAttribute("userUid");
		Member member = memberRepository.findByUid(getSessionUid);
		
		return bookmarkService.addBookmark(member.getId(), id);
	}
	
	@DeleteMapping("/bookmark/{id}")
	public ResponseEntity<Void> deleteBookmark(@PathVariable Long id, HttpSession session) {
		
		String getSessionUid = (String) session.getAttribute("userUid");
		Member member = memberRepository.findByUid(getSessionUid);
		bookmarkService.deleteBookmark(member.getId(), id);
		
		return ResponseEntity.noContent().build();
	}
	
	@PostMapping("/report/{id}")
	public Reports addReport(@PathVariable Long id, HttpSession session) {
		
		String getSessionUid = (String) session.getAttribute("userUid");
		Member member = memberRepository.findByUid(getSessionUid);
		
		return reportsService.addReport(member.getId(), id);
	}
	
	@DeleteMapping("/deletePost/{id}")
	public ResponseEntity<Void> deletePost(@PathVariable Long id) {
		
		postsService.deletePost(id);
		
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping("/adminGetPosts")
	public PostsViewGetPagesDTO adminGetPosts(@RequestParam(defaultValue = "report") String query, @RequestParam(defaultValue = "0") int page) {
		
		Page<Posts> posts = postsService.adminGetPosts(query, page);
		
		List<Posts> postlist = posts.getContent();
		List<PostViewDTO> postViesDTO = postsService.getPosts(postlist);
		
		return new PostsViewGetPagesDTO(postViesDTO, posts.getTotalPages());
	}
	
	@GetMapping("/adminGetPostDetail/{id}")
	public PostViewDTO adminGetPostDetail(@PathVariable Long id) {
		
		Posts post = postsRepository.findById(id).orElse(null);
		
		PostViewDTO test = postsService.getPostDetail(id);
		List<String> testImg = test.getImageURL();
		System.out.println(test);
		System.out.println(testImg.size());
		
		if (post != null) return postsService.getPostDetail(id);
		else return null;
			
	} 
	
	@DeleteMapping("/adminClearReports/{id}")
	public ResponseEntity<Void> clearReports(@PathVariable Long id) {
		
		reportsService.deleteAllReports(id);
		
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping("/adminUpdatePostStatus/{id}")
	public Posts adminUpdatePostStatus(@PathVariable Long id, @RequestParam(defaultValue = "1") int status) {
		
		return postsService.updatePostStatus(id, status);
		
	}
	
}
