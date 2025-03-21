package org.ai.fooddeliverybackend.Service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationFacadeImplementation implements AuthenticationFacade{
    @Override
    public Authentication getAuthentication() {
     return SecurityContextHolder.getContext().getAuthentication();
    }
}
