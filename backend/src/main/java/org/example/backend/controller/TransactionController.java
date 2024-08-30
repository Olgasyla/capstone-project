package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Transaction;
import org.example.backend.model.TransactionDto;
import org.example.backend.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    @GetMapping
    public List<Transaction> getAllTransaction() {
        return transactionService.findAllTransactions();
    }

    @GetMapping("{id}")
    public Transaction getTransactionById(@PathVariable String id){
        return transactionService.findTransactionById(id);
    }

    @PostMapping
    public Transaction addTransaction(@RequestBody TransactionDto transactionDto) {
        return transactionService.saveNewTransaction(transactionDto);
    }
    @PutMapping("{id}")
    public Transaction update(@PathVariable String id, @RequestBody TransactionDto transactionDto) {
        return transactionService.updateTransaction(id, transactionDto);
    }

    @DeleteMapping("{id}")
    void delete(@PathVariable String id) {
        transactionService.deleteTransaction(id);
    }



}
