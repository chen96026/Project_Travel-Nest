package com.example.demo.Service;

import com.example.demo.Model.Reports;

public interface ReportsService {
	public Reports addReport (Long userId, Long postId);
	public void deleteAllReports (Long postId);
}
