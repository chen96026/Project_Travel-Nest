package com.example.demo.Service;

import com.example.demo.Model.Bookmark;

public interface BookmarkService {
	public Bookmark addBookmark (Long userId, Long postId);
	public void deleteBookmark (Long userId, Long postId);
}
