import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGroupStore } from '../store/groupStore';
import ExpenseItem from '../components/ExpenseItem/ExpenseItem';
import Button from '../components/Button/Button';
import styles from './GroupDetailPage.module.css';
import AddExpenseForm from '../components/AddExpenseForm/AddExpenseForm';


const GroupDetailPage: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();

    const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);

    const selectedGroup = useGroupStore((state) => state.selectedGroup);
    const selectedGroupExpenses = useGroupStore((state) => state.selectedGroupExpenses);
    const isLoadingSelectedGroup = useGroupStore((state) => state.isLoadingSelectedGroup);
    const selectedGroupError = useGroupStore((state) => state.selectedGroupError);

    useEffect(() => {
        const storeActions = useGroupStore.getState();

        if (groupId) {
            if (
                !storeActions.isLoadingSelectedGroup &&
                (storeActions.selectedGroup?.id !== Number(groupId) ||
                    !storeActions.selectedGroup ||
                    storeActions.selectedGroupError)
            ) {
                storeActions.fetchSelectedGroupData(groupId);
            }
        }

        return () => {
            storeActions.clearSelectedGroupData();
        };
    }, [groupId, selectedGroupError]);

    const handleExpenseAdded = () => {
        setShowAddExpenseForm(false);
    };

    if (isLoadingSelectedGroup && !selectedGroup) {
        return <div className={styles.loadingMessage}>Loading group details...</div>;
    }

    if (selectedGroupError && !selectedGroup) {
        return <div className={styles.errorMessage}>Error: {selectedGroupError}</div>;
    }

    if (!selectedGroup && !isLoadingSelectedGroup) {
        return <div className={styles.notFoundMessage}>Group not found or data is unavailable.</div>;
    }

    if (!selectedGroup) {
        return <div className={styles.notFoundMessage}>Group data is missing or an unknown error occurred.</div>;
    }

    return (
        <div className={styles.pageContainer}>
            <Link to="/dashboard" className={styles.backLink}>
                ← Back to Dashboard
            </Link>

            <header className={styles.groupHeader}>
                <h1 className={styles.groupName}>{selectedGroup.name}</h1>
                <div className={styles.groupMeta}>
                    <p>
                        Owned by: <strong>{selectedGroup.owner.username}</strong>
                    </p>
                    <p>
                        Members: {selectedGroup.members.map((m) => m.username).join(', ')}
                    </p>
                </div>
                <div className={styles.groupActions}>
                    <Button onClick={() => setShowAddExpenseForm(!showAddExpenseForm)}>
                        {showAddExpenseForm ? 'Cancel Adding Expense' : '+ Add Expense'}
                    </Button>
                    <Button variant="secondary">Settle Up</Button>
                </div>
            </header>

            {showAddExpenseForm && groupId && (<section className={styles.addExpenseSection}>
                <AddExpenseForm groupId={groupId} onExpenseAdded={handleExpenseAdded} />
            </section>)}

            <section className={styles.expensesSection}>
                <h2 className={styles.sectionTitle}>Expenses</h2>
                {selectedGroupExpenses.length === 0 ? (
                    <p className={styles.noExpensesMessage}>
                        No expenses recorded in this group yet.
                    </p>
                ) : (
                    <div className={styles.expensesList}>
                        {selectedGroupExpenses.map((expense) => (
                            <ExpenseItem key={expense.id} expense={expense} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default GroupDetailPage;