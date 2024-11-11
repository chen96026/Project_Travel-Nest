package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Model.Bookmark;
import com.example.demo.Model.Member;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
	
	public Bookmark findByMemberIdAndPostsId(Long userId, Long  postId);
	
	//根據會員查詢所有收藏的貼文
    public List<Bookmark> findByMember(Member member);
}
