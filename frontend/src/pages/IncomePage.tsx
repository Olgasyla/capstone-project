import {Transaction, TransactionDto} from "../model/Transaction.ts";
import {FormEvent, useState} from "react";
import TransactionForm from "../components/TransactionForm.tsx";

type IncomePageProps ={
    data:Transaction []
    deleteTransaction: (id: string) => void,
    updateTransaction: (id: string, transaction: TransactionDto) => void,
    addTransaction: (transaction: TransactionDto) => void
}

export default function IncomePage({data, deleteTransaction, updateTransaction, addTransaction}: IncomePageProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [newTransaction, setNewTransaction] = useState<TransactionDto>({
        name: "",
        date: "",
        amount: 0,
        account: "NONE",
        description: "",
        category: "OTHER",
        type: "INCOME"
    });

    const incomeTransactions = data.filter(transaction => transaction.type === "INCOME")
    const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)

    const handleAddTransaction = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const customTransaction ={ ...newTransaction}
        customTransaction.amount = Number(customTransaction.amount)
        addTransaction(customTransaction); // Использование готовой функции
        setIsAdding(false)
        setNewTransaction({
            name: "",
            date: "",
            amount: 0,
            account: "NONE",
            description: "",
            category: "OTHER",
            type: "INCOME"
        });
    };

    return (
          <div className="main-content"> {/* Оборачиваем основной контент */}
            {/*List of expenses / Total expenses*/}
            <h1>Income list</h1>
            <h2>Total income: {totalIncome}</h2>
            {incomeTransactions.map(transaction => (
                <section key={transaction.id}>
                    <p>{transaction.name}</p>
                    <p>Sum: {transaction.amount} €</p>
                    <p>Category: {transaction.category}</p>
                    <button onClick={() => deleteTransaction(transaction.id)}>Delete</button>
                    <button onClick={() => updateTransaction(transaction.id, transaction)}>Edit</button>
                </section>
            ))}
            <button onClick={() => setIsAdding(true)}>+ Add New</button>

            {isAdding && (
                <div>
            <h2>Add New Income</h2>
            <TransactionForm
                transaction={newTransaction}
                setTransaction={setNewTransaction}
                handleSubmit={handleAddTransaction}
                action="Add Income"
                editable={true}
            />
                    <button onClick={() => setIsAdding(false)}>Cancel</button>
                </div>
            )}
        </div>
)
}



