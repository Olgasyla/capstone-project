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
    @DirtiesContext
    @Test
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
    void getTransactionByIdTest() throws Exception {
        //GIVEN
        transactionRepository.save(new Transaction("1", "Food", localDate, 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE));
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/transactions/1"))
                //THEN
                .andExpect(status().isOk())
                .andExpect(content().json("""

      {     "id": "1",
            "name": "Food",
            "date": "2024-09-01",
            "amount": 52.5,
            "account": "BANK",
            "description": "Aldi",
            "category": "FOOD",
            "type": "EXPENSE"
      }"""));
    }

    @Test
    void addTransactionTest() throws Exception {
        //GIVEN
        //WHEN
        mockMvc.perform(post("/api/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
      {     "name": "Clothes",
            "date": "2024-09-01",
            "amount": 39.99,
            "account": "BANK",
            "description": "ZARA",
            "category": "CLOTHES",
            "type": "EXPENSE"
      }
"""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Clothes"))
                .andExpect(jsonPath("$.date").value("2024-09-01"))
                .andExpect(jsonPath("$.amount").value(39.99))
                .andExpect(jsonPath("$.account").value("BANK"))
                .andExpect(jsonPath("$.description").value("ZARA"))
                .andExpect(jsonPath("$.category").value("CLOTHES"))
                .andExpect(jsonPath("$.type").value("EXPENSE"));
    }
    @DirtiesContext
    @Test
    void updateTransactionTest() throws Exception {
        //GIVEN
        transactionRepository.save(new Transaction("1","Food", localDate, 32.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE));
        //WHEN
        mockMvc.perform(put("/api/transactions/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
          { "name": "Food",
            "date": "2024-09-01",
            "amount": 32.5,
            "account": "BANK",
            "description": "Aldi",
            "category": "FOOD",
            "type": "EXPENSE"
            }"""))
                .andExpect(status().isOk())
                .andExpect(content().json("""
{           "id": "1",
            "name": "Food",
            "date": "2024-09-01",
            "amount": 32.5,
            "account": "BANK",
            "description": "Aldi",
            "category": "FOOD",
            "type": "EXPENSE"
            }
            """));
    }


    @Test
    void deleteTransactionTest() throws Exception {
        transactionRepository.save(new Transaction("1","Food", localDate, 52.5, Account.BANK, "Aldi", Category.FOOD, TransactionType.EXPENSE));
        mockMvc.perform(delete("/api/transactions/1"))
            .andExpect(status().isOk());
        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }
}