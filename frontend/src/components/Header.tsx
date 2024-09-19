
import './Header.css'
import { NavLink } from "react-router-dom"

export default function Header() {
    return (
        <header className="header">
            <h1>
                <i className="fas fa-wallet"></i> Personal Finance Tracker
            </h1>

            <nav>
                <ul>
                    <li>
                        <NavLink to="/" className={({isActive}) => (isActive ? "active" : "")}>Dashboard</NavLink>
                    </li>
                    <li>
                        <NavLink to="/transaction/add" className={({isActive}) => (isActive ? "active" : "")}>Add
                            Transaction</NavLink>
                    </li>
                    <li>
                        <NavLink to="/reports" className={({isActive}) => (isActive ? "active" : "")}>Reports</NavLink>
                    </li>
                    <li>
                        <NavLink to="/income" className={({isActive}) => (isActive ? "active" : "")}>Income
                            List</NavLink>
                    </li>
                    <li>
                        <NavLink to="/expense" className={({isActive}) => (isActive ? "active" : "")}>Expenses
                            List</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
