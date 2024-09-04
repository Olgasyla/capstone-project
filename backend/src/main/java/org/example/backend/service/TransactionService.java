package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Transaction;
import org.example.backend.model.TransactionDto;
import org.example.backend.model.TransactionType;
import org.example.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
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
    public List<Transaction> findTransactionsByType(TransactionType type) {
        return transactionRepository.findAll().stream()
                .filter(transaction -> transaction.type() == type)
                .toList();
    }
    public List<TransactionDto> getTransactionsByMonth(int month, int year) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        return transactionRepository.findAllByDateBetween(startDate, endDate)
                .stream()
                .map(transaction -> new TransactionDto(
                        transaction.name(),
                        transaction.date(),
                        transaction.amount(),
                        transaction.account(),
                        transaction.description(),
                        transaction.category(),
                        transaction.type()
                ))
                .toList();
    }
}
