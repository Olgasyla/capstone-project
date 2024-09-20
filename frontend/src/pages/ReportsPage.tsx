import React, { useEffect, useState } from "react";
import axios from "axios";
import './ReportsPage.css';
import { Transaction } from "../model/Transaction.ts"
import { Container, Typography, Box, Grid, Paper, List, ListItem, ListItemText, Select, MenuItem } from '@mui/material';

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
    const groupByAccount = (transactions: Transaction[]) => {
        return transactions.reduce((acc, transaction) => {
            if (!acc[transaction.account]) {
                acc[transaction.account] = { income: 0, expenses: 0 };
            }
            if (transaction.type === 'INCOME') {
                acc[transaction.account].income += transaction.amount;
            } else if (transaction.type === 'EXPENSE') {
                acc[transaction.account].expenses += transaction.amount;
            }
            return acc;
        }, {} as Record<string, { income: number; expenses: number }>);
    };
    const groupByCategory = (transactions: Transaction[]) => {
        return transactions.reduce((acc, transaction) => {
            if (!acc[transaction.category]) {
                acc[transaction.category] = { income: 0, expenses: 0 };
            }
            if (transaction.type === 'INCOME') {
                acc[transaction.category].income += transaction.amount;
            } else if (transaction.type === 'EXPENSE') {
                acc[transaction.category].expenses += transaction.amount;
            }
            return acc;
        }, {} as Record<string, { income: number; expenses: number }>);};

    const accountGroups = groupByAccount(transactions);
    const categoryGroups = groupByCategory(transactions);

    return (
        <Container>
            <Typography variant="h3" gutterBottom>Monthly Reports</Typography>
            <Box display="flex" justifyContent="space-between" mb={4}>
                <Box>
                    <Typography variant="h6">Month:</Typography>
                    <Select value={selectedMonth} onChange={handleMonthChange} variant="outlined" size="small">
                        {[...Array(12).keys()].map(month => (
                            <MenuItem key={month + 1} value={month + 1}>{month + 1}</MenuItem>))}
                    </Select>
                </Box>
                <Box>
                    <Typography variant="h6">Year:</Typography>
                    <Select value={selectedYear} onChange={handleYearChange} variant="outlined" size="small">
                        {[...Array(5).keys()].map(year => (
                            <MenuItem key={year + 2020} value={year + 2020}>{year + 2020}</MenuItem>))}
                    </Select>
                </Box>
            </Box>
            <Box mb={4}>
                <Typography variant="h4">Summary</Typography>
                <Paper elevation={3} style={{ padding: '16px' }}>
                    <Typography variant="body1"><strong>Current Balance:</strong> {currentBalance.toFixed(2)} €</Typography>
                    <Typography variant="body1"><strong>Monthly Income:</strong> {monthlyIncome.toFixed(2)} €</Typography>
                    <Typography variant="body1"><strong>Monthly Expenses:</strong> {monthlyExpenses.toFixed(2)} €</Typography>
                </Paper>
            </Box>

            <Typography variant="h4" gutterBottom>Transactions by Account</Typography>
            <Grid container spacing={5}>
                {Object.entries(accountGroups).map(([account, { income, expenses }]) => {
                    const balance = income - expenses;
                    return (
                        <Grid item xs={12} md={6} key={account}>
                            <Paper elevation={3} style={{ padding: '16px' }}>
                                <Typography variant="h6" gutterBottom>Account: {account}</Typography>
                                <Typography variant="body1"><strong>Income:</strong> {income.toFixed(2)} €</Typography>
                                <Typography variant="body1"><strong>Expenses:</strong> {expenses.toFixed(2)} €</Typography>
                                <Typography variant="body1"><strong>Balance:</strong> {balance.toFixed(2)} €</Typography>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            <Typography variant="h4"gutterBottom>Transactions by Category</Typography>
            <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6" gutterBottom>Income</Typography>
                        <List>
                            {Object.entries(categoryGroups).map(([category, { income }]) => (income > 0 && (
                                    <ListItem key={category}>
                                        <ListItemText
                                            //primary={<strong>Category:</strong>}
                                            secondary={category}/>
                                        <ListItemText
                                           // primary={<strong>Income:</strong>}
                                            secondary={`${income.toFixed(2)} €`}/>
                                    </ListItem>
                                )
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6" gutterBottom>Expenses</Typography>
                        <List>
                            {Object.entries(categoryGroups).map(([category, { expenses }]) => (expenses > 0 && (
                                <ListItem key={category}>
                                    <ListItemText
                                           //  primary={<strong>Category:</strong>}
                                            secondary={category}/>
                                    <ListItemText
                                            //primary={<strong>Expenses:</strong>}
                                            secondary={`${expenses.toFixed(2)} €`}/>
                                    </ListItem>)))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
