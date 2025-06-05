import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGroupStore } from '../store/groupStore';
import ExpenseItem from '../components/ExpenseItem/ExpenseItem';
import Button from '../components/Button/Button';
import styles from './GroupDetailPage.module.css';

const GroupDetailPage: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();

    const selectedGroup = useGroupStore((state) => state.selectedGroup);
    const selectedGroupExpenses = useGroupStore((state) => state.selectedGroupExpenses);
    const isLoadingSelectedGroup = useGroupStore((state) => state.isLoadingSelectedGroup);
    const selectedGroupErrorFromStore = useGroupStore((state) => state.selectedGroupError);

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
    }, [groupId, selectedGroupErrorFromStore]);

    if (isLoadingSelectedGroup && !selectedGroup) {
        return <div className={styles.loadingMessage}>Loading group details...</div>;
    }

    if (selectedGroupErrorFromStore && !selectedGroup) {
        return <div className={styles.errorMessage}>Error: {selectedGroupErrorFromStore}</div>;
    }

    if (!selectedGroup && !isLoadingSelectedGroup) {
        return <div className={styles.noFoundMessage}>Group not found or data is unavailable.</div>;
    }

    if (!selectedGroup) {
        return <div className={styles.noFoundMessage}>Group data is missing.</div>;
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
                    <Button>Add Expense</Button>
                    <Button variant="secondary">Settle Up</Button>
                </div>
            </header>

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