
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
    const category: string[] = ["RENT", "HOUSING", "UTILITIES", "ELECTRICITY", "INTERNET" ,"CELLPHONE", "SUBSCRIPTIONS",
    "TRANSPORTATION", "CLOTHES", "FOOD", "TRAVEL", "ENTERTAINMENT", "GIFTS", "EMERGENCY", "SALARY", "CHILD_BENEFIT"]

    const transactionType : TransactionType[] = ["EXPENSE", "INCOME"]
    const transactionAccount: AccountType [] = ["NONE", "BANK", "WALLET" , "PAYPAL"]

function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>): void {
    setTransaction({...transaction, [event.target.name]: event.target.value})
}

    return (
        <form onSubmit={handleSubmit} className={"transaction-form"}>
            <div className="top-section">
                <label htmlFor={"type"} className={"transaction-label"}>Transaction Type</label>
                <select required={true} value={transaction.type} onChange={handleChange} name={"type"} disabled={!editable}>
                    {transactionType.map((type) => (
                        <option key={type} value={type}>{formatEnum(type)}</option>
                    ))}
                </select>
            </div>

            <div className="bottom-section">
                <div>
                    <label htmlFor={"date"} className={"transaction-label"}>Date</label>
                    <input type={"date"} name={"date"} value={transaction.date} onChange={handleChange} required={true} disabled={!editable} />
                </div>
                <div>
                    <label className={"transaction-label"} htmlFor={"account"}>Account</label>
                    <select required={true} value={transaction.account} onChange={handleChange} name={"account"} disabled={!editable}>
                        {transactionAccount.map((account) => (
                            <option key={account} value={account}>{formatEnum(account)}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={"transaction-label"} htmlFor={"category"}>Category</label>
                    <select required={true} value={transaction.category} onChange={handleChange} name={"category"} disabled={!editable}>
                        {category.map((cat) => (
                            <option key={cat} value={cat}>{formatEnum(cat)}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={"transaction-label"} htmlFor={"description"}>Description</label>
                    <textarea  name="description" value={transaction.description} onChange={handleChange} required={true} disabled={!editable} />
                </div>
                <div>
                    <label className={"transaction-label"} htmlFor={"amount"}>Amount</label>
                    <input type={"number"} name={"amount"} value={transaction.amount} onChange={handleChange} required={true} disabled={!editable} />
                </div>
            </div>

            {editable && <button type={"submit"}>{action}</button>}
        </form>
    )
}
