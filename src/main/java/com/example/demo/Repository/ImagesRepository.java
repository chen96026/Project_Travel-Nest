package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Model.Images;
import com.example.demo.Model.Posts;

public interface ImagesRepository extends JpaRepository<Images, Long> {
	public Images findFirstByPosts(Posts posts);
	public List<Images> findByPosts(Posts posts);
}
