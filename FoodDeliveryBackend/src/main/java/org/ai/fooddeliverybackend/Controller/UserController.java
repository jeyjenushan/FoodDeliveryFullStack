package org.ai.fooddeliverybackend.Controller;


import lombok.AllArgsConstructor;
import org.ai.fooddeliverybackend.Request.UserRequest;
import org.ai.fooddeliverybackend.Response.UserResponse;
import org.ai.fooddeliverybackend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest userRequest) {

        return userService.registerUser(userRequest);
    }



}
