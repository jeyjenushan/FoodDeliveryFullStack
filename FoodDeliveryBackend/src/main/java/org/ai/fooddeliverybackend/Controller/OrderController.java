package org.ai.fooddeliverybackend.Controller;
import lombok.AllArgsConstructor;
import org.ai.fooddeliverybackend.Request.OrderRequest;
import org.ai.fooddeliverybackend.Response.OrderResponse;
import org.ai.fooddeliverybackend.Service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;


    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@RequestBody OrderRequest orderRequest){
        return orderService.createOrderWithPayment(orderRequest);
    }

    @PostMapping("/verify")
    public void verifyPayment(@RequestBody Map<String, String> paymentRequest){
        orderService.verifyPayment(paymentRequest,"Paid");

    }

    @GetMapping()
    public List<OrderResponse> getAllOrders(){
        return orderService.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId){
        orderService.deleteOrder(orderId);
    }

    @GetMapping("/all")
    public List<OrderResponse> getOrdersOfAllUsers(){
        return orderService.getOrdersOfAllUsers();
    }

    @PatchMapping("/status/{orderId}")
    public void updateOrder(@PathVariable String orderId,@RequestParam String status){
orderService.updateOrderStatus(orderId,status);

    }


}
