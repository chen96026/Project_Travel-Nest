package com.example.demo.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

import com.example.demo.Model.Posts;
import com.example.demo.dto.PostViewDTO;

public interface PostsService {
	public Sort setSort (String sortBy);
	public Page<Posts> findPosts (String country, String city, String key, Sort sort, int page);
	public Page<Posts> findPostsSortedByLikes (String country, String city, String key, int page);
	public List<PostViewDTO> getPosts(List<Posts> postlist);
	
	public PostViewDTO getPostDetail(Long id);
	public Posts newPost (Posts post, List<String> images) throws Exception;
	public Posts updatePost (Posts post, List<String> images) throws Exception;
	
	public void deletePost (Long id);
	
	public Page<Posts> adminGetPosts (String query, int page);
	
	public Posts updatePostStatus (Long id, int status);
	
}