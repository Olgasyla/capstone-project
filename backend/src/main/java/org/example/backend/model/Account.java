package org.example.backend.model;

public enum Account{
    NONE("None"),
    BANK("Bank account"),
    WALLET("My Wallet"),
    PAYPAL("PayPal"),
    CASH("Cash");

    private final String accountValue;
    Account(String accountValue) { this.accountValue = accountValue; }
    public String getAccountValue() { return accountValue; }

    }
