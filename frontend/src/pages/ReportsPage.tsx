import React, { useEffect, useState } from "react"
import axios from "axios"
import { Transaction } from "../model/Transaction.ts"
import {Container, Typography, Box, Grid, Paper, List, ListItem, ListItemText, Select, MenuItem, TextField} from '@mui/material'
import {formatEnum} from "../model/formatEnum.ts";

export default function ReportsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [currentBalance, setCurrentBalance] = useState<number>(0)
    const [monthlyIncome, setMonthlyIncome] = useState<number>(0)
    const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0)
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

    useEffect(() => {
        fetchTransactions(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    const fetchTransactions = (month: number, year: number) => {
        axios.get(`/api/transactions/month/${month}/year/${year}`)
            .then(response => {
                const data: Transaction[] = response.data;
                setTransactions(data)
                calculateStatistics(data)
            })
            .catch(error => {
                console.error("Error fetching transactions:", error)
            })}

    const calculateStatistics = (data: Transaction[]) => {
        const incomeTransactions = data.filter(t => t.type === 'INCOME')
        const expenseTransactions = data.filter(t => t.type === 'EXPENSE')
        const income = incomeTransactions.reduce((acc, t) => acc + t.amount, 0)
        const expenses = expenseTransactions.reduce((acc, t) => acc + t.amount, 0)
        setMonthlyIncome(income)
        setMonthlyExpenses(expenses)
        setCurrentBalance(income - expenses)
    }

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(Number(event.target.value))
    }

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(event.target.value))
    }
    const groupByAccount = (transactions: Transaction[]) => {
        return transactions.reduce((acc, transaction) => {
            if (!acc[transaction.account]) {
                acc[transaction.account] = { income: 0, expenses: 0 }
            }
            if (transaction.type === 'INCOME') {
                acc[transaction.account].income += transaction.amount
            } else if (transaction.type === 'EXPENSE') {
                acc[transaction.account].expenses += transaction.amount
            }
            return acc;
        }, {} as Record<string, { income: number; expenses: number }>)
    }
    const groupByCategory = (transactions: Transaction[]) => {
        return transactions.reduce((acc, transaction) => {
            if (!acc[transaction.category]) {
                acc[transaction.category] = { income: 0, expenses: 0 }
            }
            if (transaction.type === 'INCOME') {
                acc[transaction.category].income += transaction.amount
            } else if (transaction.type === 'EXPENSE') {
                acc[transaction.category].expenses += transaction.amount
            }
            return acc
        }, {} as Record<string, { income: number; expenses: number }>)}

    const accountGroups = groupByAccount(transactions)
    const categoryGroups = groupByCategory(transactions)

    const [searchTermIncomes, setSearchTermIncomes] = useState<string>("")
    const [searchTermExpenses, setSearchTermExpenses] = useState<string>("")
    const handleSearchChangeIncomes = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTermIncomes(event.target.value.toLowerCase());
    }
    const handleSearchChangeExpenses = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTermExpenses(event.target.value.toLowerCase())
    }

    return (
        <Container sx={{ marginLeft: '100px' }}>
            <Typography variant="h3" gutterBottom>Monthly Reports</Typography>
            <Box display="flex" justifyContent="flex-start" mb={4}>
                <Box display="flex" alignItems="center" mr={4}>
                    <Typography variant="h6" sx={{ mr: 1 }}>Month:</Typography>
                    <Select value={selectedMonth} onChange={handleMonthChange} variant="outlined" size="small">
                        {[...Array(12).keys()].map(month => (
                            <MenuItem key={month + 1} value={month + 1}>{month + 1}</MenuItem>))}
                    </Select>
                </Box>
                <Box display="flex" alignItems="center">
                    <Typography variant="h6" sx={{ mr: 1 }}>Year:</Typography>
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

            <Typography variant="h5" gutterBottom>Transactions by Account</Typography>
            <Grid container spacing={5}>
                {Object.entries(accountGroups).map(([account, { income, expenses }]) => {
                    const balance = income - expenses;
                    return (
                        <Grid item xs={12} md={6} key={account}>
                            <Paper elevation={3} style={{ padding: '16px' }}>
                                <Typography variant="h6" gutterBottom>Account: {account}</Typography>
                                <Typography variant="body1"><strong>Balance:</strong> {balance.toFixed(2)} €</Typography>
                                <Typography variant="body1"><strong>Income:</strong> {income.toFixed(2)} €</Typography>
                                <Typography variant="body1"><strong>Expenses:</strong> {expenses.toFixed(2)} €</Typography>

                            </Paper>
                        </Grid>
                    )})}
            </Grid>

            <Typography variant="h5" gutterBottom style={{ marginTop: '40px' }}>Transactions by Category</Typography>
            <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6" gutterBottom>Incomes by Category</Typography>
                        <TextField variant="outlined" size="small" placeholder="Search by category" value={searchTermIncomes} onChange={handleSearchChangeIncomes} style={{ marginBottom: '16px' }}/>
                        <List>
                            {Object.entries(categoryGroups)
                                .filter(([category]) => category.toLowerCase().includes(searchTermIncomes))
                                .map(([category, { income }]) => (income > 0 && (
                                    <ListItem key={category}style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', padding: '4px 0' }}>
                                        <ListItemText
                                            primary={formatEnum(category)}
                                            primaryTypographyProps={{ style: { fontSize: '18px' } }} // Увеличение шрифта
                                        />
                                        <ListItemText
                                            secondary={`${income.toFixed(2)} €`}
                                            secondaryTypographyProps={{ style: { textAlign: 'right', fontSize: '16px' } }} // Увеличение шрифта и выравнивание
                                        />
                                    </ListItem>
                                )
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6" gutterBottom>Expenses by Category</Typography>
                        <TextField variant="outlined" size="small" placeholder="Search by category" value={searchTermExpenses} onChange={handleSearchChangeExpenses} style={{ marginBottom: '16px' }}/>
                        <List>
                            {Object.entries(categoryGroups)
                                .filter(([category]) => category.toLowerCase().includes(searchTermExpenses))
                                .map(([category, { expenses }]) => (expenses > 0 && (
                                <ListItem key={category} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', padding: '4px 0' }}>
                                    <ListItemText
                                        primary={formatEnum(category)}
                                        primaryTypographyProps={{ style: { fontSize: '18px' } }} // Увеличение шрифта
                                    />
                                    <ListItemText
                                        secondary={`${expenses.toFixed(2)} €`}
                                        secondaryTypographyProps={{ style: { textAlign: 'right', fontSize: '16px' } }} // Увеличение шрифта и выравнивание
                                    />
                                </ListItem>
                            )))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}