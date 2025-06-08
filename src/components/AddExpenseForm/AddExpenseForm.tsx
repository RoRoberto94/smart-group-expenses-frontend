import React, { useState } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { useGroupStore } from '../../store/groupStore';
import type { CreateExpensePayload } from '../../services/expenseService';
import styles from './AddExpenseForm.module.css';


interface AddExpenseFormProps {
    groupId: string | number;
    onExpenseAdded: () => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ groupId, onExpenseAdded }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const addExpenseToGroup = useGroupStore((state) => state.addExpenseToGroup);
    const isCreatingExpense = useGroupStore((state) => state.isCreatingExpense);
    const createExpenseError = useGroupStore((state) => state.createExpenseError);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!description.trim() || !amount.trim() || parseFloat(amount) <= 0) {
            alert('Plase enter a valid description and a positive amount.');
            return;
        }

        const payload: CreateExpensePayload = {
            description,
            amount,
        };

        const newExpense = await addExpenseToGroup(groupId, payload);

        if (newExpense) {
            setDescription('');
            setAmount('');
            onExpenseAdded();
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.formTitle}>Add New Expense</h3>
            <Input
                label="Description"
                type="text"
                id={`expense-desc-${groupId}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isCreatingExpense}
                required
            />
            <Input
                label="Amount (RON)"
                type="number"
                id={`expense-amount-${groupId}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                disabled={isCreatingExpense}
                required
            />
            {createExpenseError && <p className={styles.errorMessage}>{createExpenseError}</p>}
            <Button type="submit" isLoading={isCreatingExpense} disabled={isCreatingExpense}>
                Add Expense
            </Button>
        </form>
    );
};

export default AddExpenseForm;