import React, { useState, useEffect } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { useGroupStore } from '../../store/groupStore';
import type { UpdateExpensePayload } from '../../services/expenseService';
import type { Expense } from '../../types/Expense';
import styles from './EditExpenseForm.module.css';

interface EditExpenseFormProps {
    groupId: string | number;
    expenseToEdit: Expense;
    onExpenseUpdated: () => void;
    onCancel: () => void;
}

const EditExpenseForm: React.FC<EditExpenseFormProps> = ({
    groupId,
    expenseToEdit,
    onExpenseUpdated,
    onCancel,
}) => {
    const [description, setDescription] = useState(expenseToEdit.description);
    const [amount, setAmount] = useState(expenseToEdit.amount);

    const editExpenseInGroup = useGroupStore((state) => state.editExpenseInGroup);
    const isUpdatingExpense = useGroupStore((state) => state.isUpdatingExpense);
    const updateExpenseError = useGroupStore((state) => state.updateExpenseError);

    useEffect(() => {
        setDescription(expenseToEdit.description);
        setAmount(expenseToEdit.amount);
    }, [expenseToEdit]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!description.trim() || !amount.trim() || parseFloat(amount) <= 0) {
            alert('Please enter a valid description and a positive amount.');
            return;
        }

        const payload: UpdateExpensePayload = {
            description,
            amount,
        };

        const updatedExpense = await editExpenseInGroup(groupId, expenseToEdit.id, payload);

        if (updatedExpense) {
            onExpenseUpdated();
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.formTitle}>Edit Expense</h3>
            <Input
                label="Description"
                type="text"
                id={`edit-expense-desc-${expenseToEdit.id}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUpdatingExpense}
                required
            />
            <Input
                label="Amount (RON)"
                type="number"
                id={`edit-expense-amount-${expenseToEdit.id}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                disabled={isUpdatingExpense}
                required
            />
            {updateExpenseError && <p className={styles.errorMessage}>{updateExpenseError}</p>}
            <div className={styles.formActions}>
                <Button type="button" onClick={onCancel} variant="secondary" disabled={isUpdatingExpense}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isUpdatingExpense} disabled={isUpdatingExpense}>
                    Save Changes
                </Button>
            </div>
        </form>
    );
};

export default EditExpenseForm;