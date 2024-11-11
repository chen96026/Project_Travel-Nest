package com.example.demo.Service;

import java.util.List;

import com.example.demo.Model.Posts;

public interface ImagesService {
	public String getCoverImgURL (Posts post);
	public List<String> getImgURLList (Posts post);
	public void deleteImgById (Long id);
}
