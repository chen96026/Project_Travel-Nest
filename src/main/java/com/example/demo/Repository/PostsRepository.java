package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.Model.Member;
import com.example.demo.Model.Posts;

public interface PostsRepository extends JpaRepository<Posts, Long> {
	// 根據狀態查詢所有公開中文章
	public Page<Posts> findByStatusGreaterThan(int status, Pageable pageable);
	
	// 根據狀態查詢所有下架（status == 0）、可以展示在首頁（status == 2）的文章
	public Page<Posts> findByStatusEquals(int status, Pageable pageable);

	// 城市篩選
	public Page<Posts> findByCityAndStatusGreaterThan(String city, int status, Pageable pageable);

	// 國家篩選
	public Page<Posts> findByCountryAndStatusGreaterThan(String country, int status, Pageable pageable);

	// 關鍵字篩選
	@Query("SELECT p FROM Posts p WHERE (p.mainTitle LIKE %:key% OR p.tags LIKE %:key%) AND p.status > 0")
	public Page<Posts> searchByKey(@Param("key") String key, Pageable pageable);

	// 城市+關鍵字篩選
	@Query("SELECT p FROM Posts p WHERE p.city = :city AND (p.mainTitle LIKE %:key% OR p.tags LIKE %:key%) AND p.status > 0")
	public Page<Posts> searchByCityAndKey(@Param("city") String city, @Param("key") String key, Pageable pageable);

	// 國家+關鍵字篩選
	@Query("SELECT p FROM Posts p WHERE p.country = :country AND (p.mainTitle LIKE %:key% OR p.tags LIKE %:key%) AND p.status > 0")
	public Page<Posts> searchByCountryAndKey(@Param("country") String country, @Param("key") String key, Pageable pageable);

	// 照讚數排序
	@Query("SELECT p FROM Posts p LEFT JOIN p.likes l WHERE p.status > 0 GROUP BY p ORDER BY COUNT(l) DESC, p.createdTime DESC")
	public Page<Posts> findAllSortedByLikes(Pageable pageable);

	// 照讚數排序+城市篩選
	@Query("SELECT p FROM Posts p LEFT JOIN p.likes l WHERE p.city = :city AND p.status > 0 GROUP BY p ORDER BY COUNT(l) DESC, p.createdTime DESC")
	public Page<Posts> findByCitySortedByLikes(@Param("city") String city, Pageable pageable);

	// 照讚數排序+國家篩選
	@Query("SELECT p FROM Posts p LEFT JOIN p.likes l WHERE p.country = :country AND p.status > 0 GROUP BY p ORDER BY COUNT(l) DESC, p.createdTime DESC")
	public Page<Posts> findByCountrySortedByLikes(@Param("country") String country, Pageable pageable);

	// 照讚數排序+關鍵字篩選
	@Query("SELECT p FROM Posts p LEFT JOIN p.likes l WHERE (p.mainTitle LIKE %:key% OR p.tags LIKE %:key%) AND p.status > 0 GROUP BY p ORDER BY COUNT(l) DESC, p.createdTime DESC")
	public Page<Posts> searchByKeySortedByLikes(@Param("key") String key, Pageable pageable);

	// 照讚數排序+城市+關鍵字篩選
	@Query("SELECT p FROM Posts p LEFT JOIN p.likes l WHERE p.city = :city AND (p.mainTitle LIKE %:key% OR p.tags LIKE %:key%) AND p.status > 0 GROUP BY p ORDER BY COUNT(l) DESC, p.createdTime DESC")
	public Page<Posts> searchByCityAndKeySortedByLikes(@Param("city") String city, @Param("key") String key, Pageable pageable);

	// 照讚數排序+國家+關鍵字篩選
	@Query("SELECT p FROM Posts p LEFT JOIN p.likes l WHERE p.country = :country AND (p.mainTitle LIKE %:key% OR p.tags LIKE %:key%) AND p.status > 0 GROUP BY p ORDER BY COUNT(l) DESC, p.createdTime DESC")
	public Page<Posts> searchByCountryAndKeySortedByLikes(@Param("country") String country, @Param("key") String key, Pageable pageable);
	
	//顯示自己的文章
	public List<Posts> findByAuthor(Member author);
	
	// 願意刊登在首頁但未審核通過文章
	@Query("SELECT p FROM Posts p WHERE p.share = true AND p.status = 1")
	public Page<Posts> findByShareTrueAndStatusEquals(Pageable pageable);
	
}
