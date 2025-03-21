package org.ai.fooddeliverybackend.Controller;


import lombok.AllArgsConstructor;
import org.ai.fooddeliverybackend.Config.JwtTokenValidator;
import org.ai.fooddeliverybackend.Request.AuthenticationRequest;
import org.ai.fooddeliverybackend.Response.AuthenticationResponse;
import org.ai.fooddeliverybackend.Service.AppUserDetaisService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetaisService appUserDetaisService;
    private final JwtTokenValidator jwtTokenValidator;

    @PostMapping("/login")
    public AuthenticationResponse Login(@RequestBody AuthenticationRequest authenticationRequest){
     authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(),authenticationRequest.getPassword()));
     final UserDetails userDetails = appUserDetaisService.loadUserByUsername(authenticationRequest.getEmail());
     final String jwtToken=jwtTokenValidator.generateToken(userDetails);
     return new AuthenticationResponse(authenticationRequest.getEmail(),jwtToken);
    }




}
