package org.ai.fooddeliverybackend.Service;

import org.ai.fooddeliverybackend.Request.CartRequest;
import org.ai.fooddeliverybackend.Response.CartResponse;

public interface CartService {

    CartResponse addToCart(CartRequest cartRequest);
    CartResponse getCart();
    void clearCart();
    CartResponse removeFromCart(CartRequest cartRequest);

}
