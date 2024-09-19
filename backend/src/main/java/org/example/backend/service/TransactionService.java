package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Transaction;
import org.example.backend.model.TransactionDto;
import org.example.backend.model.TransactionType;
import org.example.backend.repository.TransactionRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.NoSuchElementException;


@RequiredArgsConstructor
@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final IdService idService;


//    private String getCurrentUserId() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.getPrincipal() instanceof OAuth2User) {
//            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
//            return oAuth2User.getName(); // ID GitHub пользователя
//        }
//        throw new RuntimeException("User not authenticated");
//    }

    public List<Transaction> findAllTransactions() {
//        String currentUserId = getCurrentUserId();
//        return transactionRepository.findAll().stream()
//                .filter(transaction -> transaction.appUserId().equals(currentUserId))
//                .toList();
//    }
        return transactionRepository.findAll();
    }
    public Transaction findTransactionById(String id) {return transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction with id: " + id + "not found"));}

    public Transaction saveNewTransaction(TransactionDto transactionDto) {
        Transaction transaction = new Transaction(
                idService.randomId(),
                transactionDto.date(),
                transactionDto.amount(),
                transactionDto.account(),
                transactionDto.description(),
                transactionDto.category(),
                transactionDto.type(),
                transactionDto.appUserId());
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(String id, TransactionDto updateTransaction) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Transaction with id: " + id + "not found"))
                .withDate(updateTransaction.date())
                .withAmount(updateTransaction.amount())
                .withAccount(updateTransaction.account())
                .withDescription(updateTransaction.description())
                .withCategory(updateTransaction.category())
                .withType(updateTransaction.type())
                .withAppUserId(updateTransaction.appUserId());
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
        Instant startDate = yearMonth.atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant().atZone(ZoneId.systemDefault()).toInstant().minusSeconds(1);
        Instant endDate = yearMonth.atEndOfMonth().atTime(23,59,58).atZone(ZoneId.systemDefault()).toInstant();

        return transactionRepository.findAllByDateBetween(startDate, endDate)
                .stream()
                .map(transaction -> new TransactionDto(
                        transaction.date(),
                        transaction.amount(),
                        transaction.account(),
                        transaction.description(),
                        transaction.category(),
                        transaction.type(),
                        transaction.appUserId()
                ))
                .toList();
    }
}