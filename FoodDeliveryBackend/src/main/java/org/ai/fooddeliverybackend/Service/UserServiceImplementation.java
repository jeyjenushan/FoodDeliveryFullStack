package org.ai.fooddeliverybackend.Service;

import lombok.AllArgsConstructor;
import org.ai.fooddeliverybackend.Model.UserEntity;
import org.ai.fooddeliverybackend.Repository.UserRepository;
import org.ai.fooddeliverybackend.Request.UserRequest;
import org.ai.fooddeliverybackend.Response.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImplementation implements UserService{


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private  PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request) {
        UserEntity user = convertToEntity(request);
        user=userRepository.save(user);

        return convertToResponse(user);

    }

    @Override
    public String findByUserId() {
        String LoggedUserEmail = authenticationFacade.getAuthentication().getName();
        UserEntity LoggedInUser=userRepository.findByEmail(LoggedUserEmail).orElseThrow(()->new RuntimeException("User Not Found"));
        return LoggedInUser.getId();

    }


    private UserEntity convertToEntity(UserRequest userRequest) {
        return UserEntity.builder()
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .name(userRequest.getName())
                .build();


    }

    private UserResponse convertToResponse(UserEntity userEntity) {
        return UserResponse.builder()
                .id(userEntity.getId())
                .email(userEntity.getEmail())
                .name(userEntity.getName())
                .build();


    }
}
