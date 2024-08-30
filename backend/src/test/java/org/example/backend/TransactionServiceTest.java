package org.example.backend;

import org.example.backend.model.Account;
import org.example.backend.model.Category;
import org.example.backend.model.Transaction;
import org.example.backend.model.TransactionType;
import org.example.backend.repository.TransactionRepository;
import org.example.backend.service.IdService;
import org.example.backend.service.TransactionService;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TransactionServiceTest {

    private final TransactionRepository transactionRepository = mock(TransactionRepository.class);
    private final IdService idService = mock(IdService.class);
    private final TransactionService transactionService = new TransactionService(transactionRepository, idService);
    private final LocalDate localDate = LocalDate.parse("2024-09-01");

    @Test
    void findAllTransactionsTest() {
        //GIVEN
        List<Transaction> getAllTransactions = List.of(
                new Transaction("1", "Food", localDate, 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE),
                new Transaction("2", "Food", localDate, 32.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE));
        //WHEN
        List<Transaction> expectedTransactions = List.of(
                new Transaction("1", "Food", localDate, 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE),
                new Transaction("2", "Food", localDate, 32.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE));
        when(transactionRepository.findAll()).thenReturn(getAllTransactions);
        List<Transaction> actualTransactions = transactionService.findAllTransactions();
        //THEN
        verify(transactionRepository).findAll();
        assertEquals(expectedTransactions, actualTransactions);
    }

    @Test
    void findTransactionById() {
    }

    @Test
    void saveNewTransaction() {
    }

    @Test
    void updateTransaction() {
    }

    @Test
    void deleteTransaction() {
    }
}