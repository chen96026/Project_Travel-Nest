package com.example.demo.Service;

import java.util.List;

import com.example.demo.Model.News;

public interface NewsService {
	public List<News> getAll ();
	public News addNews (News news);
	public News updateNews (News news);
	public void deleteNewsById (Long id);
}
