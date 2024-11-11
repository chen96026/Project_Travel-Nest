package com.example.demo.Controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Model.News;
import com.example.demo.Service.NewsService;

@RestController
@RequestMapping("/news")
public class NewsController {

	@Autowired
	private NewsService newsService;
	
	@GetMapping("/getAll")
	public List<News> getAll() {
		return newsService.getAll();
	}
	
	@PostMapping("/add")
	public News add(
			@RequestParam String title,
			@RequestParam String text,
			@RequestParam String newsURL,
			@RequestParam String img
			) {
		System.out.println("後台 add 新聞");
		News news = new News();
		news.setTitle(title);
		news.setText(text);
		news.setUrl(newsURL);
		news.setImg(img);
		return newsService.addNews(news);
	}
	
	@PutMapping("/update")
	public News update(
			@RequestParam Long newsId,
			@RequestParam String title,
			@RequestParam String text,
			@RequestParam String newsURL,
			@RequestParam String img
			) {
		System.out.println("後台 update 新聞");
		News news = new News();
		news.setId(newsId);
		news.setTitle(title);
		news.setText(text);
		news.setUrl(newsURL);
		news.setImg(img);
		return newsService.updateNews(news);
	}
	
	@DeleteMapping("/delete/{id}")
	public void delete(@PathVariable Long id) {
		System.out.println("後台 delete 新聞");
		newsService.deleteNewsById(id);
	}
	
}
