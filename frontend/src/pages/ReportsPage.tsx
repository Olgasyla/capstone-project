import React, { useEffect, useState } from "react";
import axios from "axios";
import './ReportsPage.css';
import { Transaction } from "../model/Transaction.ts";

export default function ReportsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    useEffect(() => {
        fetchTransactions(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    const fetchTransactions = (month: number, year: number) => {
        axios.get(`/api/transactions/month/${month}/year/${year}`)
            .then(response => {
                const data: Transaction[] = response.data;
                setTransactions(data);
                calculateStatistics(data);
            })
            .catch(error => {
                console.error("Error fetching transactions:", error);
            });
    };

    const calculateStatistics = (data: Transaction[]) => {
        const income = data.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
        const expenses = data.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
        setMonthlyIncome(income);
        setMonthlyExpenses(expenses);
        setCurrentBalance(income - expenses);
    };

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(Number(event.target.value));
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(event.target.value));
    };

    return (
        <div className="reports-page">
            <h1>Monthly Reports</h1>
            <div className="filters">
                <label>
                    Month:
                    <select value={selectedMonth} onChange={handleMonthChange}>
                        {[...Array(12).keys()].map(month => (
                            <option key={month + 1} value={month + 1}>
                                {month + 1}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Year:
                    <select value={selectedYear} onChange={handleYearChange}>
                        {[...Array(5).keys()].map(year => (
                            <option key={year + 2020} value={year + 2020}>
                                {year + 2020}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="summary">
                <h2>Summary</h2>
                <p><strong>Current Balance:</strong> {currentBalance.toFixed(2)} €</p>
                <p><strong>Monthly Income:</strong> {monthlyIncome.toFixed(2)} €</p>
                <p><strong>Monthly Expenses:</strong> {monthlyExpenses.toFixed(2)} €</p>
            </div>
            <div className="transactions">
                <h2>Transactions</h2>
                <ul>
                    {transactions.map((transaction) => (
                        <li key={transaction.id}>
                            <p><strong>Date:</strong> {transaction.date}</p>
                            <p><strong>Amount:</strong> {transaction.amount.toFixed(2)} €</p>
                            <p><strong>Account:</strong> {transaction.account}</p>
                            <p><strong>Description:</strong> {transaction.description}</p>
                            <p><strong>Category:</strong> {transaction.category}</p>
                            <p><strong>Type:</strong> {transaction.type}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
