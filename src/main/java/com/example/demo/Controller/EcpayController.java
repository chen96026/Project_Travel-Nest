package com.example.demo.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Orders;
import com.example.demo.Service.EcpayService;
import com.example.demo.Service.OrdersService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class EcpayController{
	
	@Autowired
	OrdersService ordersService;
	
	@Autowired
	EcpayService ecpayService;

	@RequestMapping("/ecpayCheckout/{oid}")
	public String ecpayCheckout(@PathVariable("oid") Long orderId) {
		String aioCheckOutALLForm = ecpayService.ecpayCheckout(orderId);
		
		return aioCheckOutALLForm;
	}
	
	@PostMapping("/ecpayResult")
	public String ecpayReturnURL(HttpServletRequest request) {
		Map<String,String[]> paramMap = request.getParameterMap();

	    // 記錄接收到的所有參數
	    paramMap.forEach((key, value) -> {
	        System.out.println(key + ": " + String.join(", ", value));
	    });
	    
	    String[] rtnCodeArray = paramMap.get("RtnCode");
	    if(rtnCodeArray != null && "1".equals(rtnCodeArray[0])) {
	    	String[] merchantTradeNoArray = paramMap.get("MerchantTradeNo");
	    	if(merchantTradeNoArray != null) {
	    		String orderNumber = merchantTradeNoArray[0];
	    		
				Orders order = ordersService.getOrderByOrderNumber(orderNumber);
	    		if (order != null) {
	    			order.setOrderStatus(Orders.OrderStatus.已付款完成);
	    			ordersService.saveOrder(order);
	    			System.out.println("Order updated: " + orderNumber);
	    		}
	    		
	    	}
 	    }
 	    
	    // CustomField1~4，商家自定義的資訊，若無需要全部都可為空
	    // PaymentTypeChargeFee，表示該筆交易的手續費，0為無手續費或商家承擔，無法設定，是由ECpay自己計算
	    // SimulatePaid 為1 代表此交易為模擬付款，並非是由消費者實際真的付款。
	    
	    // 回應 ECpay ，1|OK是官方規定格式
	    return "1|OK";
	}
	
	@PostMapping("/ecpay/callback")
    public String handleEcpayCallback(@RequestParam Map<String, String> params) {
        // 解析ECPay参数
        String orderNumber = params.get("MerchantTradeNo"); //訂單編號
        String paymentStatus = params.get("RtnCode"); //支付狀態

        // 更新訂單狀態
        if ("1".equals(paymentStatus)) { // 1表示支付成功
            System.out.println(orderNumber + ":PAID");
        }

        return "OK";
    }
}

