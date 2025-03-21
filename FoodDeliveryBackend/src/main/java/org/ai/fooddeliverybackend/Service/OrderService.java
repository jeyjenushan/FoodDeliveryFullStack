package org.ai.fooddeliverybackend.Service;

import org.ai.fooddeliverybackend.Request.OrderItemRequest;
import org.ai.fooddeliverybackend.Request.OrderRequest;
import org.ai.fooddeliverybackend.Response.OrderResponse;

import java.util.List;
import java.util.Map;

public interface OrderService {


    OrderResponse createOrderWithPayment(OrderRequest orderRequest);

    void verifyPayment(Map<String,String> paymentData, String status);

    List<OrderResponse> getUserOrders();

    void deleteOrder(String orderId);

    List<OrderResponse> getOrdersOfAllUsers();
    void updateOrderStatus(String orderId,String status);


}
