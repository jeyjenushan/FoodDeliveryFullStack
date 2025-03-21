package org.ai.fooddeliverybackend.Service;

import org.ai.fooddeliverybackend.Request.UserRequest;
import org.ai.fooddeliverybackend.Response.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    String findByUserId();
}
