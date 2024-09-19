
import { Transaction, TransactionDto, TransactionType } from "../model/Transaction.ts";
import { FormEvent, useState } from "react";
import TransactionForm from "../components/TransactionForm.tsx";
import ConfirmationModal from "../modal/ConfirmationModal.tsx";
import "./IncomeList.css";
import { formatEnum } from "../model/formatEnum.ts";

type ExpensesPageProps = {
    data: Transaction[];
    deleteTransaction: (id: string) => void;
    updateTransaction: (id: string, transaction: TransactionDto) => void;
    addTransaction: (transaction: TransactionDto) => void;
};

export default function ExpensesPage({data, deleteTransaction, updateTransaction, addTransaction,}: ExpensesPageProps) {
    const [isExpensesModalOpen, setIsExpensesModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    const [newTransaction, setNewTransaction] = useState<TransactionDto>({
        date: "",
        amount: 0,
        account: "NONE",
        description: "",
        category: "OTHER",
        type: "EXPENSE",
        appUserId: ""
    })

    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

    const expensesTransactions = data
        .filter((transaction) => transaction.type === "EXPENSE")
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortDirection === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        });

    const totalExpenses = expensesTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    const openAddTransactionModal = () => {
        setNewTransaction({
            date: "",
            amount: 0,
            account: "NONE",
            description: "",
            category: "OTHER",
            type: "EXPENSE",
            appUserId: ""
        });
        setIsEditing(null);
        setIsExpensesModalOpen(true);
    };

    const openEditTransactionModal = (transaction: Transaction) => {
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
        setIsExpensesModalOpen(true)
    }

    const openConfirmationModal = (id: string) => {
        setSelectedTransactionId(id)
        setIsConfirmationModalOpen(true)
    };

    const closeModal = () => {
        setIsExpensesModalOpen(false);
        setIsConfirmationModalOpen(false);
    };

    const handleTransaction = (event: FormEvent<HTMLFormElement>, type: TransactionType) => {
        event.preventDefault();
        const customTransaction: TransactionDto = { ...newTransaction, type };
        customTransaction.amount = Number(customTransaction.amount);

        if (isEditing) {
            updateTransaction(isEditing, customTransaction);
        } else {
            addTransaction(customTransaction);
        }
        closeModal();
    };

    const handleConfirmDelete = () => {
        if (selectedTransactionId) {
            deleteTransaction(selectedTransactionId);
            closeModal();
        }
    };

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    return (
        <div className="main-content">
            <h1>Expenses</h1>
            <h2>Total Amount: {totalExpenses} €</h2>

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
                {expensesTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                        <td>{transaction.date}</td>
                        <td>{formatEnum(transaction.account)}</td>
                        <td>{formatEnum(transaction.category)}</td>
                        <td>{transaction.description}</td>
                        <td>{transaction.amount.toFixed(2)} €</td>
                        <td>
                            <button onClick={() => openEditTransactionModal(transaction)}>Edit</button>
                            <button onClick={() => openConfirmationModal(transaction.id)}>Delete</button>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button className="add-new-button" onClick={openAddTransactionModal}>+ Add New</button>

            {isExpensesModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{isEditing ? "Edit Transaction" : "Add New Transaction"}</h2>
                        <TransactionForm
                            transaction={newTransaction}
                            setTransaction={setNewTransaction}
                            handleSubmit={(event) => handleTransaction(event, "EXPENSE")}
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


