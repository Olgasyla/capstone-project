
import Header from "./components/Header"
import {useEffect, useState} from "react"
import {Transaction, TransactionDto} from "./model/Transaction.ts"
import axios, {AxiosResponse} from "axios"
import {Route, Routes} from "react-router-dom"
import AddTransactionPage from "./pages/AddTransactionPage.tsx"
import Dashboard from "./components/Dashboard.tsx"
import IncomePage from "./pages/IncomePage.tsx"
import ExpensesPage from "./pages/ExpensesPage.tsx"
import ReportsPage from "./pages/ReportsPage.tsx"
import ProtectedRoutes from "./components/ProtectedRoutes.tsx"
import {AppUser} from "./model/AppUser.ts"
import './App.css'
import {FaGithub} from "react-icons/fa"

export default function App() {

     const [user, setUser] = useState<AppUser | null | undefined>(undefined)
     const [data, setData] = useState<Transaction[]>([])

     const fetchTransactions = () => {
         if (user) {
         axios.get('/api/transactions')
             .then((response : AxiosResponse<Transaction[]> )=> {
                 setData(response.data
                     .filter(transaction => transaction.appUserId == user.id))
             })
             .catch(error => {
                 console.error("Es gab einen Fehler beim Abrufen der Daten!", error);
             })
     }}
     const deleteTransaction = (id: string) => {
         axios.delete("/api/transactions/" + id)
             .then((response) => response.status === 200 && fetchTransactions())
             .catch((error) => console.log(error.message))
     }

     const updateTransaction = (id: string, transaction: TransactionDto) => {
         axios.put(`/api/transactions/${id}`, transaction)
             .then((response) => response.status === 200 && fetchTransactions())
             .catch((error) => console.log(error.response.data));
     }

     const addTransaction = (transaction: TransactionDto) => {
         if (user) {
             axios.post("/api/transactions", {...transaction, appUserId: user.id})
                 .then((response) => response.status === 200 && fetchTransactions())
                 .catch((error) => console.log(error.message));
         }}

     const login = () => {
         const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080': window.location.origin
         window.open(host + '/oauth2/authorization/github', '_self')
     }
     const getUser =() =>{
         axios.get("api/users/me")
             .then((response)=> {
                 console.log(response.data)
                 setUser(response.data)
             })
             .catch(()=>{
                 setUser(null) })
             }

     function logout() {
         const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080' : window.location.origin
         window.open(host + '/logout', '_self')
     }


     useEffect(getUser,[]);
     useEffect(() => {fetchTransactions()}, [user]);

    return (
        <>
            { !user ? (
                <div className="login-screen">
                    <h1>Personal Finance Tracker</h1>
                    <button onClick={login} className="github-button">
                        <FaGithub style={{marginRight: '8px'}}/> Login with GitHub
                    </button>
                </div>) : (
                <>
                    <Header />
                    <div className="main-content">
                        <div className="user-info">
                            {user?.avatarUrl && (
                                <img
                                    src={user.avatarUrl}
                                    alt={`${user.username}'s avatar`}
                                    style={{width: '40px', height: '40px', borderRadius: '50%'}}
                                />
                            )}
                            <p>{user?.username}</p>
                            {user && <button onClick={logout} className="logout-button">Logout</button>}
                        </div>

                        <Routes>
                            <Route element={<ProtectedRoutes user={user}/>}>
                                <Route path="/" element={<Dashboard/>}/>
                                <Route path="transaction/add"
                                       element={<AddTransactionPage addTransaction={addTransaction}/>}/>
                                <Route path="/reports" element={<ReportsPage/>}/>
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
                            </Route>
                        </Routes>
                    </div>
                </>
            )
            }
        </>
    )
 }

