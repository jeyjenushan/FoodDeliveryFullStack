package org.ai.fooddeliverybackend.Service;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.ai.fooddeliverybackend.Model.UserEntity;
import org.ai.fooddeliverybackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class AppUserDetaisService implements UserDetailsService {

    @Autowired
private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity=userRepository.findByEmail(username)
                .orElseThrow(()->new UsernameNotFoundException("User not found"));

        return new User(userEntity.getEmail(),userEntity.getPassword(), Collections.emptyList());

    }
}
