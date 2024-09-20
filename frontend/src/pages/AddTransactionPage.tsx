
import {FormEvent, useState} from 'react'
import TransactionForm from '../components/TransactionForm'
import { useNavigate } from 'react-router-dom'
import {TransactionDto} from "../model/Transaction.ts"


type FetchProps ={
    addTransaction: (transaction: TransactionDto) => void;
}

export default function AddTransaction ({ addTransaction}: Readonly<FetchProps>) {

    const [transaction, setTransaction] = useState<TransactionDto>({
        date: "",
        amount: 0,
        account: "NONE",
        description: "",
        category: "FOOD",
        type: "EXPENSE",
        appUserId: ""
    })
    const navigate = useNavigate()
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addTransaction(transaction)

        navigate("/transactions")
    }

    return (
        <div className="main-content">
            <h1>Add Transaction</h1>
            <TransactionForm transaction = {transaction} setTransaction={setTransaction} handleSubmit = {handleSubmit} action={"Add"} editable={true}/>
        </div>
    )}

