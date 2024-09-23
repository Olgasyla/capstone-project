
import  {ChangeEvent, Dispatch, FormEvent, SetStateAction} from 'react'
import {AccountType, TransactionDto, TransactionType} from "../model/Transaction.ts"
import {formatEnum} from "../model/formatEnum.ts"
import './TransactionForm.css'

type TransactionFormProps = {
    transaction: TransactionDto,
    setTransaction: Dispatch<SetStateAction<TransactionDto>>,
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void,
    action: string,
    editable: boolean}


export default function TransactionForm({transaction, setTransaction, handleSubmit, action, editable}: Readonly<TransactionFormProps>) {
    const category: string[] = ["RENT", "HOUSING", "UTILITIES", "ELECTRICITY", "INTERNET", "CELLPHONE", "SUBSCRIPTIONS",
        "TRANSPORTATION", "CLOTHES", "FOOD", "TRAVEL", "ENTERTAINMENT", "GIFTS", "EMERGENCY", "SALARY", "CHILD_BENEFIT", "OTHER"]

    const transactionType: TransactionType[] = ["EXPENSE", "INCOME"]
    const transactionAccount: AccountType [] = ["NONE", "BANK", "WALLET", "PAYPAL", "CASH"]

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>): void {
        const { name, value } = event.target;

        if (name === "amount") {
            const formattedValue = value.replace(/^0+/, ''); // Удаляем ведущие нули
            // Преобразуем строку в число
            setTransaction({ ...transaction, [name]: formattedValue ? parseFloat(formattedValue) : 0 });
        } else {
            setTransaction({ ...transaction, [name]: value });
        }
    }


    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-grid">
                <label htmlFor="type" className="transaction-label">Transaction Type</label>
                <select
                    required
                    value={transaction.type}
                    onChange={handleChange}
                    name="type"
                    disabled={!editable}
                >
                    {transactionType.map((type) => (
                        <option key={type} value={type}>{formatEnum(type)}</option>
                    ))}
                </select>

                <label htmlFor="date" className="transaction-label">Date</label>
                <input
                    type="date"
                    name="date"
                    value={transaction.date}
                    onChange={handleChange}
                    required
                    disabled={!editable}
                />

                <label htmlFor="account" className="transaction-label">Account</label>
                <select
                    required
                    value={transaction.account}
                    onChange={handleChange}
                    name="account"
                    disabled={!editable}
                >
                    {transactionAccount.map((account) => (
                        <option key={account} value={account}>{formatEnum(account)}</option>
                    ))}
                </select>

                <label htmlFor="category" className="transaction-label">Category</label>
                <select
                    required
                    value={transaction.category}
                    onChange={handleChange}
                    name="category"
                    disabled={!editable}
                >
                    {category.map((cat) => (
                        <option key={cat} value={cat}>{formatEnum(cat)}</option>
                    ))}
                </select>

                <label htmlFor="description" className="transaction-label">Description</label>
                <textarea
                    name="description"
                    value={transaction.description}
                    onChange={handleChange}
                    required
                    disabled={!editable}
                />

                <label htmlFor="amount" className="transaction-label">Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={transaction.amount !== 0 ? transaction.amount : ''}
                    onChange={handleChange}
                    required
                    disabled={!editable}
                />
            </div>
            {editable && <button type="submit">{action}</button>}
        </form>
    );
}