package org.example.backend.model;
import lombok.With;

import java.time.LocalDate;

@With
public record Transaction (

        String id,
        LocalDate date,
        Double amount,
        Account account,
        String description,
        Category category,
        TransactionType type)
{}
