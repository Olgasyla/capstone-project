package org.example.backend.model;
import lombok.With;
import java.time.LocalDate;

@With
public record TransactionDto (

        String name,
        LocalDate date,
        Double amount,
        String description,
        Category category,
        Account account
) {}
