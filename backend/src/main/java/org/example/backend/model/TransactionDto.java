package org.example.backend.model;
import lombok.With;
import java.time.LocalDate;

@With
public record TransactionDto (

        LocalDate date,
        Double amount,
        Account account,
        String description,
        Category category,
        TransactionType type,
        String appUserId
) {}
