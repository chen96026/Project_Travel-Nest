package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Model.Likes;

public interface LikesRepository extends JpaRepository<Likes, Long> {

	public Likes findByMemberIdAndPostsId(Long userId, Long  postId);
	
}