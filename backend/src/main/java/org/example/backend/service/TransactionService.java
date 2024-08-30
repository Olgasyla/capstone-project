package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Transaction;
import org.example.backend.model.TransactionDto;
import org.example.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@RequiredArgsConstructor
@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final IdService idService;

    public List<Transaction> findAllTransactions() {
        return transactionRepository.findAll();
    }
    public Transaction findTransactionById(String id) {return transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction with id: " + id + "not found"));}

    public Transaction saveNewTransaction(TransactionDto transactionDto) {
        Transaction transaction = new Transaction(
                idService.randomId(),
                transactionDto.name(),
                transactionDto.date(),
                transactionDto.amount(),
                transactionDto.account(),
                transactionDto.description(),
                transactionDto.category(),
                transactionDto.type());
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(String id, TransactionDto updateTransaction) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Transaction with id: " + id + "not found"))
                .withName(updateTransaction.name())
                .withDate(updateTransaction.date())
                .withAmount(updateTransaction.amount())
                .withAccount(updateTransaction.account())
                .withDescription(updateTransaction.description())
                .withCategory(updateTransaction.category())
                .withType(updateTransaction.type());
                return transactionRepository.save(transaction);
    }
    public void deleteTransaction(String id) {
        transactionRepository.deleteById(id);
    }
}
