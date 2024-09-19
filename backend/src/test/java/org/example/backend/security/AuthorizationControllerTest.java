package org.example.backend.security;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
class AuthorizationControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    @DirtiesContext
    @WithMockUser
    void getLoggetInUserTest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/me")
                        .with(oidcLogin().idToken(token ->token.subject("123"))
                                .userInfoToken(token -> token.claim("login","Olgasyla")
                                        .claim("avatar_url", "https://avatars.githubusercontent.com/u/173792650?v=4"))))
                .andExpect(status().isOk())
                .andExpect((content().json("""
                    {  "id": "123",
                       "username": "Olgasyla",
                       "avatarUrl":"https://avatars.githubusercontent.com/u/173792650?v=4"
                    }
                  """)));
    }
}