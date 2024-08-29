package org.example.backend.model;

public enum Category {
    RENT("Rent"),
    HOUSING("Housing"),
    UTILITIES("Utilities"),
    ELECTRICITY("Electricity"),
    INTERNET("Internet"),
    CELLPHONE("Cell phone"),
    SUBSCRIPTIONS("Subscriptions"),  //ПОДПИСКА
    TRANSPORTATION("Transportation"),
    CLOTHES("Clothes"),
    FOOD("Food"),
    TRAVEL("Travel"),
    ENTERTAINMENT("Entertainment"),
    GIFTS("Gifts"),
    EMERGENCY("Emergency Fund");


    private final String categoryValue;
    Category(String categoryValue) { this.categoryValue = categoryValue; }
    public String getCategoryValue() { return categoryValue; }


}
