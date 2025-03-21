package org.ai.fooddeliverybackend.Service;
import com.stripe.model.Customer;
import org.ai.fooddeliverybackend.Model.OrderEntity;
import org.ai.fooddeliverybackend.Repository.CartRepository;
import org.ai.fooddeliverybackend.Repository.OrderRepository;
import org.ai.fooddeliverybackend.Request.OrderRequest;
import org.ai.fooddeliverybackend.Response.OrderResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service

public class OrderServiceImplementation implements OrderService {

    @Autowired
    private  OrderRepository orderRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Autowired
    private  UserService userService;

    @Autowired
    private CartRepository cartRepository;

    @Override
    public OrderResponse createOrderWithPayment(OrderRequest orderRequest) {
        Stripe.apiKey = stripeApiKey;

        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (orderRequest.getAmount() * 100)) // Convert to cents
                    .setCurrency("usd")// Change currency if needed
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            OrderEntity entity = convertToEntity(orderRequest);
            entity.setOrderStatus("Pending");
            entity.setPaymentStatus("Paid");
            entity.setUserId(userService.findByUserId());
            entity.setPaymentId(paymentIntent.getId());
            entity.setStripePaymentIntentId(paymentIntent.getId()); // Store Stripe payment intent ID
           entity.setClientSecret(paymentIntent.getClientSecret());
            entity = orderRepository.save(entity);




            return convertToResponse(entity);
        } catch (StripeException e) {

            throw new RuntimeException("Error creating Stripe PaymentIntent: " + e.getMessage());
        }
    }

    @Override
    public void verifyPayment(Map<String, String> paymentData, String status) {
        String paymentIntentId = paymentData.get("stripe_payment_intent_id");
        if (paymentIntentId == null) {
            throw new RuntimeException("Stripe Payment Intent ID is missing");
        }

        OrderEntity existingOrder = orderRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        existingOrder.setPaymentStatus(status);

        // Ensure `payment_id` exists before setting it
        if (paymentData.containsKey("payment_id")) {
            existingOrder.setPaymentId(paymentData.get("payment_id"));
        }

        orderRepository.save(existingOrder); // Save only once

        // If payment is successful, clear the user's cart
        if ("paid".equalsIgnoreCase(status)) {
            cartRepository.deleteByUserId(existingOrder.getUserId());
        }
    }





    @Override
    public List<OrderResponse> getUserOrders() {

    String loggedInUserId = userService.findByUserId();
List<OrderEntity> list=orderRepository.findByUserId(loggedInUserId);
return list.stream().map(this::convertToResponse).collect(Collectors.toList());
          }

    @Override
    public void deleteOrder(String orderId) {
        orderRepository.deleteById(orderId);

    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        List<OrderEntity> list=orderRepository.findAll();
        return list.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {

        OrderEntity entity = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
         entity.setOrderStatus(status);
         orderRepository.save(entity);
    }

    private OrderResponse convertToResponse(OrderEntity entity) {
        return OrderResponse.builder()
                .id(entity.getId())
                .orderStatus(entity.getOrderStatus())
                .paymentStatus(entity.getPaymentStatus())
                .amount(entity.getAmount())
                .userAddress(entity.getUserAddress())
                .userId(entity.getUserId())
                .orderStatus(entity.getOrderStatus())
                .email(entity.getEmail())
                .phoneNumber(entity.getPhoneNumber())
                .paymentIntentId(entity.getStripePaymentIntentId())
                .orderedItems(entity.getOrderItems())
                .clientSecret(entity.getClientSecret())
                .build();


    }

    private OrderEntity convertToEntity(OrderRequest orderRequest) {
           return OrderEntity.builder()
                   .amount(orderRequest.getAmount())
                   .orderItems(orderRequest.getOrderItemRequests())
                   .email(orderRequest.getEmail())
                   .phoneNumber(orderRequest.getPhoneNumber())
                   .userAddress(orderRequest.getUserAddress())
                   .orderStatus(orderRequest.getOrderStatus())
                   .build();


    }
}
