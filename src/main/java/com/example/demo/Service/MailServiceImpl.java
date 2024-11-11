package com.example.demo.Service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.example.demo.Model.Support;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailServiceImpl implements MailService {
	
	@Autowired
	private JavaMailSender javaMailSender;
	
	@Autowired
	private TemplateEngine templateEngine;

	
	@Override
	public void sendSupportMail(Support support) throws MessagingException, IOException {

		MimeMessage mimeMailMessage = javaMailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(mimeMailMessage, false);
		
		// 設定寄件人名稱
		helper.setFrom("Travel Nest 通知信<wingssearch20@gmail.com>");
		// 設定收件人信箱
		helper.setTo(support.getEmail());
		// 設定信件標題
		helper.setSubject("【Travel Nest】（自動回信）我們已收到您的來信");
		
		// 設定 thymeleaf 變數
		Context context = new Context();
		context.setVariable("id", support.getId());
		context.setVariable("name", support.getName());
		context.setVariable("email", support.getEmail());
		context.setVariable("phone", support.getPhone());
		context.setVariable("orderId", (support.getOrderId() != null) ? support.getOrderId() : "");
		context.setVariable("category", support.getCategory());
		
		support.setContent(support.getContent().replace("\r\n", "<br/>"));
		context.setVariable("content", support.getContent());
		
		// 設定要使用的模板 html
		String mailContent = templateEngine.process("supportMailTemplates", context);
		helper.setText(mailContent, true);
		
		javaMailSender.send(mimeMailMessage);
	}

}