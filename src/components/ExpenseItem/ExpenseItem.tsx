import React from 'react';
import type { Expense } from '../../types/Expense';
import styles from './ExpenseItem.module.css';
import Button from '../Button/Button';
import { useAuthStore } from '../../store/authStore';

interface ExpenseItemProps {
    expense: Expense;
    onEdit: (expense: Expense) => void;
    onDelete: (expenseId: number) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onEdit, onDelete }) => {

    const currentUser = useAuthStore((state) => state.user);
    const canModify = currentUser?.id === expense.paid_by.id;

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

            {canModify && (
                <div className={styles.actions}>
                    <Button
                        onClick={() => onEdit(expense)}
                        variant="secondary"
                        className={styles.actionButton}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => onDelete(expense.id)}
                        variant="secondary"
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                    >
                        Delete
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ExpenseItem;