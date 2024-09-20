package org.example.backend.model;

import lombok.With;
import org.springframework.data.mongodb.core.mapping.Document;


@With
@Document("users")
public record AppUser(
        String id,
        String username,
        String avatarUrl

) {
}
