package com.example.demo.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class WebInterceptor implements HandlerInterceptor {

	// 進入 Controller 之前執行，是否能進入頁面或跳轉都在這裡設定
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {

		String getSessionUid = (String) request.getSession().getAttribute("userUid");
		System.out.println("攔截器");
		System.out.println(getSessionUid);

		if (getSessionUid == null) {
			String requestURI = request.getRequestURI();
			if (requestURI.startsWith("/forum/edit") || requestURI.equals("/orders/order") || requestURI.startsWith("/orders/Complete") || requestURI.startsWith("/memberpage")) {
				System.out.println("攔截路徑: " + requestURI);
				response.sendRedirect("/login?redirectURL=" + requestURI);
				return false;
			}
		}

		return true;

	}

	// 進入 Controller 之後執行，在視圖被渲染前調用
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); 
		response.setHeader("Pragma", "no-cache"); 
		response.setDateHeader("Expires", 0); 
	}

	// 整個請求結束之後，視圖渲染完成後執行
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {

	}

}
