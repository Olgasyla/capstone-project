import {Transaction, TransactionDto} from "../model/Transaction.ts";
import {useState, FormEvent} from "react";
import TransactionForm from "../components/TransactionForm.tsx";
import {formatEnum} from "../model/formatEnum.ts";

type ExpensesPageProps ={
    data: Transaction[],
    deleteTransaction: (id: string) => void,
    updateTransaction: (id: string, transaction: TransactionDto) => void,
    addTransaction: (transaction: TransactionDto) => void
}

export default function ExpensesPage({data, deleteTransaction, updateTransaction, addTransaction}: ExpensesPageProps) {

    const [isAdding, setIsAdding] = useState(false)
    const [newTransaction, setNewTransaction] = useState<TransactionDto>({
        name: "",
        date: "",
        amount: 0,
        account: "NONE",
        description: "",
        category: "OTHER",
        type: "EXPENSE"
    });

    const expensesTransactions = data.filter(transaction => transaction.type === "EXPENSE");
    const totalExpenses = expensesTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    const handleAddTransaction = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const customTransaction ={ ...newTransaction}
        customTransaction.amount = Number(customTransaction.amount)
        addTransaction(customTransaction);
        setIsAdding(false)
        setNewTransaction({
            name: "",
            date: "",
            amount: 0,
            account: "NONE",
            description: "",
            category: "OTHER",
            type: "EXPENSE"
        });
    };

    return (
        <div className="main-content"> {/* Оборачиваем основной контент */}
            <h1>List of expenses</h1>
            <h2>Total expenses: {totalExpenses}</h2>
            {expensesTransactions.map(transaction => (
                <section key={transaction.id}>
                    <p>Category: {formatEnum(transaction.category)}</p>
                    <p>Account: {formatEnum(transaction.account)}</p>
                    <p>{transaction.name}</p>
                    <p>Amount: {transaction.amount} €</p>

                    <button onClick={() => deleteTransaction(transaction.id)}>Delete</button>
                    <button onClick={() => updateTransaction(transaction.id, transaction)}>Edit</button>
                </section>
            ))}
            <button onClick={() => setIsAdding(true)}>+ Add New</button>

            {isAdding && (
                <div>
            <h2>Add New Expense</h2>
            <TransactionForm
                transaction={newTransaction}
                setTransaction={setNewTransaction}
                handleSubmit={handleAddTransaction}
                action="Add Expense"
                editable={true}
            />
                    <button onClick={() => setIsAdding(false)}>Cancel</button>
                </div>
            )}
        </div>
    )
}




