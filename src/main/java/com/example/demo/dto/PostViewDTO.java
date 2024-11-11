package com.example.demo.dto;

import java.time.LocalDate;
import java.util.List;

import com.example.demo.Model.Posts;

public class PostViewDTO {

	private Posts post;
	private String coverImgURL;
	private List<String> imageURL;
	private LocalDate createdDate;
	private UserNameIconDTO userNameIconDTO;
	private Long countLikes;
	private Long countReports;
	
	public PostViewDTO (Posts post, String coverImgURL, LocalDate createdDate, UserNameIconDTO userNameIconDTO, Long countLikes, Long countReports) {
		this.post = post;
		this.coverImgURL = coverImgURL;
		this.createdDate = createdDate;
		this.userNameIconDTO = userNameIconDTO;
		this.countLikes = countLikes;
		this.countReports = countReports;
	}
	
	public PostViewDTO (Posts post, List<String> imageURL, LocalDate createdDate, UserNameIconDTO userNameIconDTO, Long countLikes, Long countReports) {
		this.post = post;
		this.imageURL = imageURL;
		this.createdDate = createdDate;
		this.userNameIconDTO = userNameIconDTO;
		this.countLikes = countLikes;
		this.countReports = countReports;
	}

	
	public Posts getPost() {
		return post;
	}

	public void setPost(Posts post) {
		this.post = post;
	}

	public String getCoverImgURL() {
		return coverImgURL;
	}

	public void setCoverImgURL(String coverImgURL) {
		this.coverImgURL = coverImgURL;
	}

	public List<String> getImageURL() {
		return imageURL;
	}

	public void setImageURL(List<String> imageURL) {
		this.imageURL = imageURL;
	}

	public LocalDate getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDate createdDate) {
		this.createdDate = createdDate;
	}

	public UserNameIconDTO getUserNameIconDTO() {
		return userNameIconDTO;
	}

	public void setUserNameIconDTO(UserNameIconDTO userNameIconDTO) {
		this.userNameIconDTO = userNameIconDTO;
	}

	public Long getCountLikes() {
		return countLikes;
	}

	public void setCountLikes(Long countLikes) {
		this.countLikes = countLikes;
	}

	public Long getCountReports() {
		return countReports;
	}

	public void setCountReports(Long countReports) {
		this.countReports = countReports;
	}
	
	
}
