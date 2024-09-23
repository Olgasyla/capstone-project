
import {Transaction, TransactionDto, TransactionType} from "../model/Transaction.ts"
import { FormEvent, useState } from "react"
import TransactionForm from "../components/TransactionForm.tsx"
import ConfirmationModal from "../modal/ConfirmationModal.tsx"
import "./IncomeList.css"
import { formatEnum } from "../model/formatEnum.ts"

type IncomePageProps = Readonly<{
    data: Transaction[]
    deleteTransaction: (id: string) => void
    updateTransaction: (id: string, transaction: TransactionDto) => void
    addTransaction: (transaction: TransactionDto) => void }>

export default function IncomePage({data, deleteTransaction, updateTransaction, addTransaction}: IncomePageProps) {
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)
    const [isEditing, setIsEditing] = useState<string | null>(null)
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Начальное значение - текущий месяц
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Начальное значение - текущий год

    const [newTransaction, setNewTransaction] = useState<TransactionDto>({
        date: "",
        amount: 0,
        account: "NONE",
        description: "",
        category: "OTHER",
        type: "INCOME",
        appUserId: ""
    })

    const incomeTransactions = data
        .filter((transaction) => transaction.type === "INCOME")
        .filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() + 1 === selectedMonth && transactionDate.getFullYear() === selectedYear;
        })
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortDirection === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        })

    const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)

    const openAddIncomeTransactionModal = () => {
        setNewTransaction({
            date: "",
            amount: 0,
            account: "NONE",
            description: "",
            category: "OTHER",
            type: "INCOME",
            appUserId: ""
        })
        setIsEditing(null)
        setIsIncomeModalOpen(true)
    }

    const openEditIncomeTransactionModal = (transaction: Transaction) => {
        setNewTransaction({
            date: transaction.date,
            amount: transaction.amount,
            account: transaction.account,
            description: transaction.description,
            category: transaction.category,
            type: transaction.type,
            appUserId: transaction.appUserId
        })
        setIsEditing(transaction.id)
        setIsIncomeModalOpen(true)}

    const openConfirmationModal = (id: string) => {
        setSelectedTransactionId(id)
        setIsConfirmationModalOpen(true)}

    const closeModal = () => {
        setIsIncomeModalOpen(false);
        setIsConfirmationModalOpen(false)}

    const handleAddTransaction = (event: FormEvent<HTMLFormElement>, transactionType: TransactionType) => {
        event.preventDefault()
        const customTransaction: TransactionDto = { ...newTransaction, type: transactionType }
        customTransaction.amount = Number(customTransaction.amount)
        addTransaction(customTransaction)
        closeModal()}

    const handleUpdateTransaction = (event: FormEvent<HTMLFormElement>, type: "INCOME" | "EXPENSE") => {
        event.preventDefault()
        if (isEditing) {
            const updatedTransaction = {...newTransaction, type};
            updateTransaction(isEditing, updatedTransaction);
            closeModal()}
    }
    const handleConfirmDelete = () => {
        if (selectedTransactionId) {
            deleteTransaction(selectedTransactionId)
            closeModal()}
    }
    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(Number(event.target.value))
    }
    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(event.target.value))
    }
    const toggleSortDirection = () => {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    }

    return (
        <div className="main-content">
            <h1>Income</h1>
            <div className="date-picker">
                <label htmlFor="month-select">Month: </label>
                <select value={selectedMonth} onChange={handleMonthChange}>{Array.from({length: 12}, (_, index) => (
                        <option key={index + 1} value={index + 1}>{index + 1}</option>))}
                </select>
                <label htmlFor="jahr-select">Year: </label>
                <select value={selectedYear} onChange={handleYearChange}>{Array.from({length: 5}, (_, index) => (
                        <option key={index + new Date().getFullYear()} value={index + new Date().getFullYear()}>{index + new Date().getFullYear()}</option>))}
                </select>
            </div>
            <h2 className="total-income-header">Total Amount: {totalIncome} €</h2>
            <button className="add-new-button" onClick={openAddIncomeTransactionModal}>+ Add New</button>
            <table className="transaction-table">
                <thead>
                <tr>
                    <th onClick={toggleSortDirection}>
                        Date {sortDirection === "asc" ? "▲" : "▼"}
                    </th>
                    <th>Account</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {incomeTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                        <td>{transaction.date}</td>
                        <td>{formatEnum(transaction.account)}</td>
                        <td>{formatEnum(transaction.category)}</td>
                        <td>{transaction.description}</td>
                        <td>{(transaction.amount).toFixed(2)} €</td>
                        <td className="actions-column">
                            <button onClick={() => openEditIncomeTransactionModal(transaction)}>Edit</button>
                            <button onClick={() => openConfirmationModal(transaction.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {isIncomeModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{isEditing ? "Edit Transaction" : "Add New Transaction"}</h2>
                        <TransactionForm
                            transaction={newTransaction}
                            setTransaction={setNewTransaction}
                            handleSubmit={(event) => isEditing ? handleUpdateTransaction(event, "INCOME") : handleAddTransaction(event, "INCOME")}
                            action={isEditing ? "Save" : "Add"}
                            editable={true}
                        />
                        <button className="modal-close" onClick={closeModal}>X</button>
                    </div>
                </div>
            )}
            {isConfirmationModalOpen && (
                <ConfirmationModal
                    isOpen={isConfirmationModalOpen}
                    onClose={closeModal}
                    onConfirm={handleConfirmDelete}
                    message="Do you want to delete the transaction??"
                />
            )}
        </div>
    )
}