package org.ai.fooddeliverybackend.Response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ai.fooddeliverybackend.Request.OrderItemRequest;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {

    private String id;
    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private double amount;
    private String paymentStatus;
    private String orderStatus;
    public String paymentIntentId;
    private List<OrderItemRequest> orderedItems;
    private String clientSecret;


}
