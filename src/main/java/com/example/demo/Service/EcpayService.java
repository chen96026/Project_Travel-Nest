package com.example.demo.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.Orders;

import ecpay.payment.integration.AllInOne;
import ecpay.payment.integration.domain.AioCheckOutALL;

@Service
public class EcpayService {
    @Autowired
    private OrdersService ordersService;

    public String ecpayCheckout(Long oid) {
        // 取得訂單編號和金額
        Orders order = ordersService.getOrderById(oid);
        if (order == null) {
            throw new IllegalArgumentException("Order not found with ID: " + oid);
        }
        
        String orderNumber = order.getOrderNumber();
        String orderPrice = String.valueOf(order.getFinalPrice().intValue());

        // 當前時間
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        System.out.println(dateFormat.format(date));

        AllInOne all = new AllInOne("");

        AioCheckOutALL obj = new AioCheckOutALL();
        
        // 設定訂單信息
        obj.setMerchantTradeNo(orderNumber); // 訂單編號
        obj.setMerchantTradeDate(dateFormat.format(date)); // 當前時間
        obj.setTotalAmount(orderPrice); // 價格
        obj.setTradeDesc("test Description"); // 交易描述
        obj.setItemName("機票款"); // 交易商品
        obj.setReturnURL("https://bf98-114-46-175-233.ngrok-free.app/orders/Toback"); // 成功後的回傳網址
        obj.setClientBackURL("http://localhost:8890/homepage"); // 回到商店的網址
        obj.setNeedExtraPaidInfo("N"); // 是否需要額外交易資訊
        obj.setCustomField1("..."); // 設定自訂資訊
        

        // 生成表單
        String form = all.aioCheckOut(obj, null);
        
        return form;
    }
}

