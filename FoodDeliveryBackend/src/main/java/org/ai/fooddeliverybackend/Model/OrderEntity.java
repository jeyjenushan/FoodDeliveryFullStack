package org.ai.fooddeliverybackend.Model;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ai.fooddeliverybackend.Request.OrderItemRequest;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "orders")
@Builder
public class OrderEntity {

    @Id
    private String id;
    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private List<OrderItemRequest> orderItems;
    private double amount;
    private String paymentStatus;
    private String stripePaymentIntentId;
    private String orderStatus;
    private String paymentId;
    private String clientSecret;

}
