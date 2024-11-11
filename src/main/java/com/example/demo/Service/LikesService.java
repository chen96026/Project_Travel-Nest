package com.example.demo.Service;

import com.example.demo.Model.Likes;

public interface LikesService {
	public Likes addLike (Long userId, Long postId);
	public void deleteLike (Long userId, Long postId);
}
