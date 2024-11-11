package com.example.demo.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.demo.interceptor.WebInterceptor;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
	
	@Autowired
	private WebInterceptor webInterceptor;
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		
		registry.addInterceptor(webInterceptor)
				.addPathPatterns("/forum/edit/**","/orders/order","/orders/Complete/**","/memberpage");	// 要被攔截的路徑 ("/forum/edit/**", "其他路徑")
//				.excludePathPatterns("");	// 指定不被攔截的路徑，可以有需要再設
		
	}

}
