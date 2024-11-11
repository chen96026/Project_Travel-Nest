package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.Bookmark;
import com.example.demo.Repository.BookmarkRepository;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.Repository.PostsRepository;

@Service
public class BookmarkServiceImpl implements BookmarkService{
	
	@Autowired
	private BookmarkRepository bookmarkRepository;
	
	@Autowired
	private PostsRepository postsRepository;
	
	@Autowired
	private MemberRepository memberRepository;

	
	@Override
	public Bookmark addBookmark(Long userId, Long postId) {
		
		if (userId != null && postId != null) {
		
		Bookmark bookmark = new Bookmark();
		bookmark.setMember(memberRepository.findById(userId).orElse(null));
		bookmark.setPosts(postsRepository.findById(postId).orElse(null));
		return bookmarkRepository.save(bookmark);
		
		} else return null;
	}

	@Override
	public void deleteBookmark(Long userId, Long postId) {
		
		Bookmark bookmark = bookmarkRepository.findByMemberIdAndPostsId(userId, postId);
		
		if (bookmark != null) bookmarkRepository.delete(bookmark);
		
	}

}