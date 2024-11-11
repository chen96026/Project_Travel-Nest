package com.example.demo.dto;

import java.util.List;

public class PostsViewGetPagesDTO {

	private List<PostViewDTO> postViewDTOList;
	private int totalPage;
	

	public PostsViewGetPagesDTO(List<PostViewDTO> postViewDTOList, int totalPage) {
		this.postViewDTOList = postViewDTOList;
		this.totalPage = totalPage;
	}
	
	
	public List<PostViewDTO> getPostViewDTOList() {
		return postViewDTOList;
	}
	
	public void setPostViewDTOList(List<PostViewDTO> postViewDTOList) {
		this.postViewDTOList = postViewDTOList;
	}

	public int getTotalPage() {
		return totalPage;
	}
	
	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}
	
}
