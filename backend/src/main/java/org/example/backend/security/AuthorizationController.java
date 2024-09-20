package org.example.backend.security;

import org.example.backend.model.AppUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/users")
public class AuthorizationController {

    @GetMapping("/me")
    public AppUser getLoggedInUser(@AuthenticationPrincipal OAuth2User user) {
    return new AppUser(user.getName(),
            user.getAttributes().get("login").toString(),
            user.getAttributes().get("avatar_url").toString());

    }
}

