
import {FormEvent, useState} from 'react'
import TransactionForm from '../components/TransactionForm'
import { useNavigate } from 'react-router-dom'
import {TransactionDto} from "../model/Transaction.ts"
import axios from "axios"

type FetchProps ={fetchTransactions: () => void}

export default function AddTransaction ({fetchTransactions}: Readonly<FetchProps>) {

    const [transaction, setTransaction] = useState<TransactionDto>({
        name: "",
        date: "",
        amount: 0,
        account: "NONE",
        description: "",
        category: "FOOD",
        type: "EXPENSE"
    })
    const navigate = useNavigate()
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        axios.post("/api/transactions", transaction)
            .then(response => console.log(response))
            .then(() => fetchTransactions())
            .catch(error => console.log(error))

        navigate("/transactions")
    }

    return (
        <div className="main-content">
            <h1>Add Transaction</h1>
            <TransactionForm transaction = {transaction} setTransaction={setTransaction} handleSubmit = {handleSubmit} action={"Add"} editable={true}/>
        </div>
    )}

