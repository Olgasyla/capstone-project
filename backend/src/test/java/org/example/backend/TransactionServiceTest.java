package org.example.backend;

import org.example.backend.model.*;
import org.example.backend.repository.TransactionRepository;
import org.example.backend.service.IdService;
import org.example.backend.service.TransactionService;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

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
                new Transaction("1",  localDate, 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE),
                new Transaction("2",  localDate, 32.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE));
        //WHEN
        List<Transaction> expectedTransactions = List.of(
                new Transaction("1",  localDate, 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE),
                new Transaction("2", localDate, 32.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE));
        when(transactionRepository.findAll()).thenReturn(getAllTransactions);
        List<Transaction> actualTransactions = transactionService.findAllTransactions();
        //THEN
        verify(transactionRepository).findAll();
        assertEquals(expectedTransactions, actualTransactions);
    }

    @Test
    void findTransactionByIdTest() {
        //GIVEN
        Transaction transaction = new Transaction("3",  localDate, 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE);
        when(transactionRepository.findById("3")).thenReturn(Optional.of(transaction));
        //WHEN
        Transaction actual = transactionService.findTransactionById("3");
        //THEN
        Transaction expected = new Transaction("3",  localDate, 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE);
        verify(transactionRepository).findById("3");
        assertEquals(expected, actual);
    }

    @Test
    void saveNewTransactionTest() {
        //GIVEN
        //WHEN
        TransactionDto transactionDto = new TransactionDto( localDate, 12.5, Account.WALLET, "Cinema", Category.ENTERTAINMENT, TransactionType.EXPENSE);
        Transaction toSave = new Transaction("4",
                transactionDto.date(), transactionDto.amount(), transactionDto.account(), transactionDto.description(),
                transactionDto.category(),transactionDto.type());
        when(transactionRepository.save(toSave)).thenReturn(toSave);
        when(idService.randomId()).thenReturn(toSave.id());

        //WHEN
        Transaction actual = transactionService.saveNewTransaction(transactionDto);
        //THEN
        Transaction expected = new Transaction("4",transactionDto.date(), transactionDto.amount(), transactionDto.account(), transactionDto.description(),
                transactionDto.category(),transactionDto.type());
        verify(transactionRepository).save(toSave);
        verify(idService).randomId();
        assertEquals(expected, actual);
    }

    @Test
    void updateTransactionTest() {
        //GIVEN
        String id = "4";
        TransactionDto transactionDto = new TransactionDto( localDate, 12.5, Account.WALLET, "Cinema", Category.ENTERTAINMENT, TransactionType.EXPENSE);
        Transaction transaction = new Transaction(id,localDate, 12.5, Account.WALLET, "Cinema", Category.ENTERTAINMENT, TransactionType.EXPENSE);
        when(transactionRepository.findById(id)).thenReturn(Optional.of(transaction));
        when(transactionRepository.save(transaction)).thenReturn(transaction);

        //WHEN
        Transaction actual = transactionService.updateTransaction(id, transactionDto);

        //THEN
        verify(transactionRepository).findById(id);
        verify(transactionRepository).save(transaction);
        assertEquals(transaction, actual);
    }

    @Test
    void deleteTransactionTest() {
        doNothing().when(transactionRepository).deleteById("2");
        transactionRepository.deleteById("2");
        verify(transactionRepository).deleteById("2");
    }
    @Test
    void getTransactionsByMonthTest() {
        // GIVEN
        Instant startDate = YearMonth.of(2024, 9).atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant().atZone(ZoneId.systemDefault()).toInstant().minusSeconds(1);
        Instant endDate = YearMonth.of(2024, 9).atEndOfMonth().atTime(23, 59, 58).atZone(ZoneId.systemDefault()).toInstant();

        Transaction transaction1 = new Transaction("1",  LocalDate.parse("2024-09-01"), 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE);
        Transaction transaction2 = new Transaction("2",  LocalDate.parse("2024-09-05"), 75.0, Account.BANK, "Zara", Category.CLOTHES, TransactionType.EXPENSE);

        List<Transaction> transactions = List.of(transaction1, transaction2);

        when(transactionRepository.findAllByDateBetween(startDate, endDate)).thenReturn(transactions);

        // WHEN
        List<TransactionDto> actual = transactionService.getTransactionsByMonth(9, 2024);

        // THEN
        List<TransactionDto> expected = List.of(
                new TransactionDto( LocalDate.parse("2024-09-01"), 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE),
                new TransactionDto( LocalDate.parse("2024-09-05"), 75.0, Account.BANK, "Zara", Category.CLOTHES, TransactionType.EXPENSE)
        );
        verify(transactionRepository).findAllByDateBetween(startDate, endDate);
        assertEquals(expected, actual);
    }

    @Test
    void findTransactionsByTypeTest() {
        // GIVEN
        Transaction transaction1 = new Transaction("1",  localDate, 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE);
        Transaction transaction2 = new Transaction("2",  LocalDate.parse("2024-08-25"), 1500.0, Account.BANK, "Work", Category.OTHER, TransactionType.INCOME);

        List<Transaction> transactions = List.of(transaction1, transaction2);
        when(transactionRepository.findAll()).thenReturn(transactions);

        // WHEN
        List<Transaction> actual = transactionService.findTransactionsByType(TransactionType.EXPENSE);

        // THEN
        List<Transaction> expected = List.of(transaction1);
        verify(transactionRepository).findAll();
        assertEquals(expected, actual);
    }
    }
