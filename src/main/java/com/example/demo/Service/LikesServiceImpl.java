package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.Likes;
import com.example.demo.Repository.LikesRepository;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.Repository.PostsRepository;

@Service
public class LikesServiceImpl implements LikesService{
	
	@Autowired
	private LikesRepository likesRepository;
	
	@Autowired
	private PostsRepository postsRepository;
	
	@Autowired
	private MemberRepository memberRepository;

	
	@Override
	public Likes addLike(Long userId, Long postId) {
		if (userId != null && postId != null) {
		
		Likes like = new Likes();
		like.setMember(memberRepository.findById(userId).orElse(null));
		like.setPosts(postsRepository.findById(postId).orElse(null));
		
		return likesRepository.save(like);
		
		} else return null;
		
	}

	@Override
	public void deleteLike(Long userId, Long postId) {
		
		Likes like = likesRepository.findByMemberIdAndPostsId(userId, postId);
		
		if (like != null) likesRepository.delete(like);
	}

}
