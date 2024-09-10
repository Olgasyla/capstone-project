
import React from 'react';
import { Transaction } from '../model/Transaction';

interface Props {
    transactions: Transaction[];
}

const TransactionList: React.FC<Props> = ({ transactions }) => {
    return (
        <ul>
            {transactions.map((transaction) => (
                <li key={transaction.id}>
                    {transaction.date} - {transaction.category}: ${transaction.amount} ({transaction.description})
                </li>
            ))}
        </ul>
    );
};

export default TransactionList;

