package org.ai.fooddeliverybackend.Controller;


import lombok.AllArgsConstructor;
import org.ai.fooddeliverybackend.Request.CartRequest;
import org.ai.fooddeliverybackend.Response.CartResponse;
import org.ai.fooddeliverybackend.Service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    public CartResponse addToCart(@RequestBody CartRequest request){
      String foodId = request.getFoodId();
      if(foodId == null || foodId.isEmpty()){
throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Food Id");
      }
     return cartService.addToCart(request);

    }

    @GetMapping
    public CartResponse getCart(){
        return cartService.getCart();
    }
@DeleteMapping
@ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(){
      cartService.clearCart();
    }

 @PutMapping
public CartResponse removeFromCart(@RequestBody CartRequest request){
     String foodId = request.getFoodId();
     if(foodId == null || foodId.isEmpty()){
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Food Id");
     }
     return  cartService.removeFromCart(request);

}
}
