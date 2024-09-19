package org.example.backend;

import org.example.backend.model.Account;
import org.example.backend.model.Category;
import org.example.backend.model.Transaction;
import org.example.backend.model.TransactionType;
import org.example.backend.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import java.time.LocalDate;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
class TransactionControllerTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    TransactionRepository transactionRepository;

    private final LocalDate localDate = LocalDate.parse("2024-09-01");
    private final String appUserId = "user123";


    @DirtiesContext
    @Test
    @WithMockUser(username = "user123")
    void getAllTransactionTest() throws Exception {
        //GIVEN
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/transactions"))

                //THEN
                .andExpect(status().isOk())
                .andExpect(content().json("""
                            []
                        """));
    }
    @DirtiesContext
    @Test
    @WithMockUser(username = "user123")
    void getTransactionByIdTest() throws Exception {
        //GIVEN

        transactionRepository.save(new Transaction("1", localDate, 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE, appUserId));
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/transactions/1"))
                //THEN
                .andExpect(status().isOk())
                .andExpect(content().json("""

      {     "id": "1",
            "date": "2024-09-01",
            "amount": 52.5,
            "account": "BANK",
            "description": "Aldi",
            "category": "FOOD",
            "type": "EXPENSE",
        "appUserId": "user123"
      }"""));
    }

    @Test
    @WithMockUser(username = "user123")
    void addTransactionTest() throws Exception {
        //GIVEN
        //WHEN
        mockMvc.perform(post("/api/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
      {
            "date": "2024-09-01",
            "amount": 39.99,
            "account": "BANK",
            "description": "ZARA",
            "category": "CLOTHES",
            "type": "EXPENSE",
            "appUserId": "user123"
      }
"""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.date").value("2024-09-01"))
                .andExpect(jsonPath("$.amount").value(39.99))
                .andExpect(jsonPath("$.account").value("BANK"))
                .andExpect(jsonPath("$.description").value("ZARA"))
                .andExpect(jsonPath("$.category").value("CLOTHES"))
                .andExpect(jsonPath("$.type").value("EXPENSE"))
                .andExpect(jsonPath("$.appUserId").value("user123"));
    }
    @DirtiesContext
    @Test
    @WithMockUser(username = "user123")
    void updateTransactionTest() throws Exception {
        //GIVEN
        transactionRepository.save(new Transaction("1", localDate, 32.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE, appUserId));
        //WHEN
        mockMvc.perform(put("/api/transactions/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
          {
            "date": "2024-09-01",
            "amount": 32.5,
            "account": "BANK",
            "description": "Aldi",
            "category": "FOOD",
            "type": "EXPENSE",
            "appUserId": "user123"
            }"""))
                .andExpect(status().isOk())
                .andExpect(content().json("""
{           "id": "1",
            "date": "2024-09-01",
            "amount": 32.5,
            "account": "BANK",
            "description": "Aldi",
            "category": "FOOD",
            "type": "EXPENSE",
            "appUserId": "user123"
            }
            """));
    }


    @Test
    @WithMockUser(username = "user123")
    void deleteTransactionTest() throws Exception {
        transactionRepository.save(new Transaction("1", localDate, 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE, appUserId));
        mockMvc.perform(delete("/api/transactions/1"))
            .andExpect(status().isOk());
        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }
    @DirtiesContext
    @Test
    @WithMockUser(username = "user123")
    void getTransactionsByMonthTest() throws Exception {
        //GIVEN
        transactionRepository.save(new Transaction("1", LocalDate.parse("2024-09-01"), 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE, appUserId));
        transactionRepository.save(new Transaction("2",  LocalDate.parse("2024-09-05"), 75.0, Account.BANK, "Zara", Category.CLOTHES, TransactionType.EXPENSE, appUserId));
        transactionRepository.save(new Transaction("3",  LocalDate.parse("2024-08-25"), 1500.0, Account.BANK, "Work", Category.OTHER, TransactionType.INCOME, appUserId));


        long count = transactionRepository.count();
        System.out.println("Transactions in DB: " + count);

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/transactions/month/9/year/2024"))
                //THEN
                .andExpect(status().isOk())
                .andExpect(content().json("""
              [
              {
                    "date": "2024-09-01",
                    "amount": 52.5,
                    "account": "BANK",
                    "description": "Aldi",
                    "category": "FOOD",
                    "type": "EXPENSE",
                     "appUserId": "user123"
                },
                {
                    "date": "2024-09-05",
                    "amount": 75.0,
                    "account": "BANK",
                    "description": "Zara",
                    "category": "CLOTHES",
                    "type": "EXPENSE",
                    "appUserId": "user123"
                }]
            """));
    }
    @DirtiesContext
    @Test
    @WithMockUser(username = "user123")
    void getTransactionsByTypeTest() throws Exception {
        // GIVEN
        transactionRepository.save(new Transaction("1", LocalDate.parse("2024-09-01"), 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE, appUserId));
        transactionRepository.save(new Transaction("2",  LocalDate.parse("2024-09-05"), 75.0, Account.BANK, "Zara", Category.CLOTHES, TransactionType.EXPENSE, appUserId));
        transactionRepository.save(new Transaction("3",  LocalDate.parse("2024-08-25"), 1500.0, Account.BANK, "Work", Category.OTHER, TransactionType.INCOME, appUserId));

        long count = transactionRepository.count();
        System.out.println("Transactions in DB: " + count);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/transactions/type/EXPENSE"))
                // THEN
                .andExpect(status().isOk())
                .andExpect(content().json("""
              [
              {
                    "date": "2024-09-01",
                    "amount": 52.5,
                    "account": "BANK",
                    "description": "Aldi",
                    "category": "FOOD",
                    "type": "EXPENSE",
                    "appUserId": "user123"
                },
                {
                    "date": "2024-09-05",
                    "amount": 75.0,
                    "account": "BANK",
                    "description": "Zara",
                    "category": "CLOTHES",
                    "type": "EXPENSE",
                    "appUserId": "user123"
                }]
            """));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/transactions/type/INCOME"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
              [
              {
                    "date": "2024-08-25",
                    "amount": 1500.0,
                    "account": "BANK",
                    "description": "Work",
                    "category": "OTHER",
                    "type": "INCOME",
                    "appUserId": "user123"
              }]
            """));}
}