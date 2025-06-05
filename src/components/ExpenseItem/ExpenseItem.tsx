import React from 'react';
import type { Expense } from '../../types/Expense';
import styles from './ExpenseItem.module.css';


interface ExpenseItemProps {
    expense: Expense;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
    return (
        <div className={styles.expenseItem}>
            <div className={styles.header}>
                <h4 className={styles.description}>{expense.description}</h4>
                <span className={styles.amount}>{parseFloat(expense.amount).toFixed(2)} RON</span>
            </div>
            <p className={styles.paidBy}>Paid by: {expense.paid_by.username}</p>
            <div className={styles.splits}>
                <p className={styles.splitsTitle}>Split between:</p>
                <ul className={styles.splitsList}>
                    {expense.splits.map((split) => (
                        <li key={split.id} className={styles.splitDetail}>
                            {split.owed_by.username}: {parseFloat(split.amount).toFixed(2)} RON
                        </li>
                    ))}
                </ul>
            </div>
            <p className={styles.date}>Added: {new Date(expense.created_at).toLocaleString()}</p>
        </div>
    );
};

export default ExpenseItem;