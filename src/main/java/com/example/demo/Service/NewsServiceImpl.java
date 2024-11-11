package com.example.demo.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.News;
import com.example.demo.Repository.NewsRepository;

@Service
public class NewsServiceImpl implements NewsService{

	@Autowired
	private NewsRepository newsRepo;

	@Override
	public List<News> getAll() {
		return newsRepo.findAll();
	}

	@Override
	public News addNews(News news) {
		return newsRepo.save(news);
	}

	@Override
	public News updateNews(News news) {
		News newsDB = newsRepo.findById(news.getId()).orElse(null);
		if ( newsDB != null ) {
			if ( news.getTitle() != null && !news.getTitle().isEmpty() ) {
				newsDB.setTitle(news.getTitle());;
			}
			if ( news.getText() != null && !news.getText().isEmpty() ) {
				newsDB.setText(news.getText());;
			}
			if ( news.getUrl() != null && !news.getUrl().isEmpty() ) {
				newsDB.setUrl(news.getUrl());;
			}
			if ( news.getImg() != null && !news.getUrl().isEmpty() ) {
				newsDB.setImg(news.getImg());;
			}
			return newsRepo.save(newsDB);
			
		} else {
			System.out.println("The target to be updated does not exist.");
			return null;
		}
	}

	@Override
	public void deleteNewsById(Long id) {
		newsRepo.deleteById(id);
	}
	
	
}
