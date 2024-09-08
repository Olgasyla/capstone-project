
import './Header.css';
import {Link} from "react-router-dom";

export default function Header(){
    return (
        <header className="header">
            <h1>Personal Finance Tracker</h1>
            <nav>
                <ul>
                    <li><Link to="/">Dashboard</Link></li>
                    <li><Link to="/transaction/add">Add Transaction</Link></li>
                    <li><Link to="/reports">Reports</Link></li>
                    <li><Link to="/income">Income List</Link></li>
                    <li><Link to="/expense">Expenses List</Link></li>
                </ul>
            </nav>
        </header>
    )
}

