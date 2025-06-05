import type { User } from './User';


export interface ExpenseSplit {
    id: number;
    owed_by: User;
    amount: string;
}

export interface Expense {
    id: number;
    group: number;
    description: string;
    amount: string;
    paid_by: User;
    splits: ExpenseSplit[];
    created_at: string;
}
