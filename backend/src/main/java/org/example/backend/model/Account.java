package org.example.backend.model;

public enum Account{
    BANK("Bank account"),
    WALLET("My Wallet"),
    PAYPAL("PayPal");

    private final String accountValue;
    Account(String accountValue) { this.accountValue = accountValue; }
    public String getAccountValue() { return accountValue; }

    }
