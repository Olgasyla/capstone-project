

import Header from "./components/Header"
import {useEffect, useState} from "react"
import {Transaction, TransactionDto} from "./model/Transaction.ts"
import axios from "axios";
import {Route, Routes} from "react-router-dom"
import AddTransactionPage from "./pages/AddTransactionPage.tsx"
import Dashboard from "./components/Dashboard.tsx"
import IncomePage from "./pages/IncomePage.tsx"
import ExpensesPage from "./pages/ExpensesPage.tsx"


 export default function App() {

    // const [user, setUser] = useState<string | null | undefined>(undefined)
     const [data, setData] = useState<Transaction[]>([])

     const fetchTransactions = () => {

         axios.get('/api/transactions')
             .then(response => {
                 setData(response.data)
             })
             .catch(error => {
                 console.error("Es gab einen Fehler beim Abrufen der Daten!", error);
             })
     }
     const deleteTransaction = (id: string) => {
         axios.delete("/api/transactions/" + id)
             .then((response) => response.status === 200 && fetchTransactions())
             .catch((error) => console.log(error.message))
     }

     const updateTransaction = (id: string, transaction: TransactionDto) => {
         axios.put(`/api/transactions/${id}/update`, transaction)
             .then((response) => response.status === 200 && fetchTransactions())
             .catch((error) => console.log(error.response.data))
     }
     const addTransaction = (transaction: TransactionDto) => {
         axios.post("/api/transactions", transaction)
             .then((response) => response.status === 200 && fetchTransactions())
             .catch((error) => console.log(error.message));
     };


     // const [searchInput, setSearchInput] = useState("")
     //
     // const filteredTransaction: Transaction[] = data
     //     .filter((transaction) => transaction.type?.toLowerCase().includes(searchInput.toLowerCase()) ||
     //         transaction.category?.toLowerCase().includes(searchInput.toLowerCase()))

     useEffect(() => {
         fetchTransactions()
     }, [])

    return (
        <>
        <Header />
        <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="transaction/add" element={<AddTransactionPage fetchTransactions={fetchTransactions}/>} />
            {/*<Route path="/reports" element={<ReportsPage />} />*/}
            <Route path="/income" element={
                <IncomePage
                    data={data}
                    deleteTransaction={deleteTransaction}
                    updateTransaction={updateTransaction}
                    addTransaction={addTransaction}
                />}
            />
            <Route path="/expense" element={
                <ExpensesPage
                    data={data}
                    deleteTransaction={deleteTransaction}
                    updateTransaction={updateTransaction}
                    addTransaction={addTransaction}
                />}
            />
        </Routes>
        </>
    )
}


