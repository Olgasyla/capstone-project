
export type AccountType = 'NONE' | 'BANK' | 'WALLET' | 'PAYPAL';

export type CategoryType =
    | 'RENT'
    | 'HOUSING'
    | 'UTILITIES'
    | 'ELECTRICITY'
    | 'INTERNET'
    | 'CELLPHONE'
    | 'SUBSCRIPTIONS'
    | 'TRANSPORTATION'
    | 'CLOTHES'
    | 'FOOD'
    | 'TRAVEL'
    | 'ENTERTAINMENT'
    | 'GIFTS'
    | 'EMERGENCY'
    | 'SALARY'
    | 'CHILD_BENEFIT'
    | 'OTHER';

export type TransactionType = 'INCOME' | 'EXPENSE';

export type Transaction = {
    id: string,
    date: string,
    amount: number,
    account: AccountType,
    description: string,
    category: CategoryType,
    type: TransactionType
}

export type TransactionDto = {
    date: string,
    amount: number,
    account: AccountType,
    description: string,
    category: CategoryType,
    type: TransactionType
}
