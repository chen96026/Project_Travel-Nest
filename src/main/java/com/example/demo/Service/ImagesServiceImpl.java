package com.example.demo.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.Images;
import com.example.demo.Model.Posts;
import com.example.demo.Repository.ImagesRepository;
import com.example.demo.Repository.PostsRepository;

@Service
public class ImagesServiceImpl implements ImagesService{
	
	@Autowired
	ImagesRepository imagesRepository;
	
	@Autowired
	PostsRepository postsRepository;
	

	@Override
	public String getCoverImgURL(Posts post) {
		
		Images firstImg = imagesRepository.findFirstByPosts(post);
		
		return firstImg.getImage();
	}
	
	
	@Override
	public List<String> getImgURLList (Posts post) {
		
		List<String> imageURLlist = new ArrayList<String>();
		
		for (Images image : imagesRepository.findByPosts(post)) {
			imageURLlist.add(image.getImage());
		}
		
		return imageURLlist;
	}


	@Override
	public void deleteImgById(Long id) {
		
		imagesRepository.deleteById(id);
	}


	
}
