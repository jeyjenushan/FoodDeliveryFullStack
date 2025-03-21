package org.ai.fooddeliverybackend.Service;


import lombok.AllArgsConstructor;
import org.ai.fooddeliverybackend.Model.CartEntity;
import org.ai.fooddeliverybackend.Repository.CartRepository;
import org.ai.fooddeliverybackend.Request.CartRequest;
import org.ai.fooddeliverybackend.Response.CartResponse;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CartServiceImplementation implements CartService {

    private final CartRepository cartRepository;
    private final UserService userService;

    @Override
    public CartResponse addToCart(CartRequest cartRequest) {
        String LoggedInUserId=userService.findByUserId();
        Optional<CartEntity> cartEntity=cartRepository.findByUserId(LoggedInUserId);
        CartEntity cart=cartEntity.orElseGet(()->new CartEntity(LoggedInUserId,new HashMap<>()));
        Map<String,Integer>cartItems=cart.getItems();
        cartItems.put(cartRequest.getFoodId(), cartItems.getOrDefault(cartRequest.getFoodId(),0)+1);
        cart.setItems(cartItems);
       cart= cartRepository.save(cart);
       return convertToResponse(cart);

    }

    @Override
    public CartResponse getCart() {
        String LoggedInUserId=userService.findByUserId();
        CartEntity cartEntity=cartRepository.findByUserId(LoggedInUserId)
                .orElse(new CartEntity(null,LoggedInUserId,new HashMap<>()));
        return convertToResponse(cartEntity);

    }

    @Override
    public void clearCart() {
        String LoggedInUserId=userService.findByUserId();
        cartRepository.deleteByUserId(LoggedInUserId);
    }

    @Override
    public CartResponse removeFromCart(CartRequest cartRequest) {
        String LoggedInUserId=userService.findByUserId();
CartEntity cartEntity=cartRepository.findByUserId(LoggedInUserId).orElseThrow(()->new RuntimeException("User not found"));
Map<String,Integer> cartItems=cartEntity.getItems();
if(cartItems.containsKey(cartRequest.getFoodId())){
    int currentQuantity=cartItems.get(cartRequest.getFoodId());
    if(currentQuantity>0) {
        cartItems.put(cartRequest.getFoodId(), currentQuantity - 1);
    }else{
        cartItems.remove(cartRequest.getFoodId());
    }
    cartEntity=cartRepository.save(cartEntity);

}

        return convertToResponse(cartEntity);
    }

    private CartResponse convertToResponse(CartEntity cartEntity) {
       return CartResponse.builder()
                .id(cartEntity.getId())
                .userId(cartEntity.getUserId())
                .items(cartEntity.getItems())
                .build();

    }


}
