import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGroupStore } from '../store/groupStore';
import ExpenseItem from '../components/ExpenseItem/ExpenseItem';
import Button from '../components/Button/Button';
import styles from './GroupDetailPage.module.css';
import AddExpenseForm from '../components/AddExpenseForm/AddExpenseForm';
import SettlementTransactionItem from '../components/SettlementTransactionItem/SettlementTransactionItem';
import EditExpenseForm from '../components/EditExpenseForm/EditExpenseForm';
import type { Expense } from '../types/Expense';
import { useAuthStore } from '../store/authStore';
import ManageMembers from '../components/ManageMembers/ManageMembers';


const GroupDetailPage: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();

    const currentUser = useAuthStore((state) => state.user);

    const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
    const [showSettlement, setShowSettlement] = useState(false);
    const [showEditExpenseForm, setShowEditExpenseForm] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

    const selectedGroup = useGroupStore((state) => state.selectedGroup);
    const selectedGroupExpenses = useGroupStore((state) => state.selectedGroupExpenses);
    const isLoadingSelectedGroup = useGroupStore((state) => state.isLoadingSelectedGroup);
    const selectedGroupError = useGroupStore((state) => state.selectedGroupError);
    const fetchSelectedGroupData = useGroupStore((state) => state.fetchSelectedGroupData);
    const clearSelectedGroupData = useGroupStore((state) => state.clearSelectedGroupData);

    const settlementPlan = useGroupStore((state) => state.settlementPlan);
    const isLoadingSettlement = useGroupStore((state) => state.isLoadingSettlement);
    const settlementError = useGroupStore((state) => state.settlementError);
    const getSettlementPlan = useGroupStore((state) => state.getSettlementPlan);
    const clearSettlementPlan = useGroupStore((state) => state.clearSettlementPlan);

    const removeExpenseFromGroup = useGroupStore((state) => state.removeExpenseFromGroup);
    const deleteExpenseError = useGroupStore((state) => state.deleteExpenseError);

    useEffect(() => {
        if (groupId) {
            if ((!selectedGroup || selectedGroup.id !== Number(groupId)) && !isLoadingSelectedGroup) {
                fetchSelectedGroupData(groupId);
            }
        }
    }, [groupId, fetchSelectedGroupData, selectedGroup, isLoadingSelectedGroup]);

    useEffect(() => {
        return () => {
            clearSelectedGroupData();
        }
    }, [clearSelectedGroupData]);

    const handleExpenseAdded = () => {
        setShowAddExpenseForm(false);

        clearSettlementPlan();
        setShowSettlement(false);
    };

    const handleSettleUpClick = () => {
        if (groupId) {
            if (showSettlement) {
                clearSettlementPlan();
                setShowSettlement(false);
            } else {
                getSettlementPlan(groupId);
                setShowSettlement(true);
            }
        }
    };

    const handleEditExpenseClick = (expense: Expense) => {
        setExpenseToEdit(expense);
        setShowEditExpenseForm(true);
        setShowAddExpenseForm(false);
        setShowSettlement(false);
        useGroupStore.getState().clearSettlementPlan();
    };

    const handleDeleteExpenseClick = async (expenseId: number) => {
        if (window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
            if (groupId) {
                const success = await removeExpenseFromGroup(groupId, expenseId);
                if (success) {
                    setShowSettlement(false);
                } else {
                    const errorMsg = useGroupStore.getState().deleteExpenseError;
                    alert(`Failed to delete expense: ${errorMsg || 'Unknown error'}`);
                }
            }
        }
    };

    const handleExpenseUpdated = () => {
        setShowEditExpenseForm(false);
        setExpenseToEdit(null);
        setShowSettlement(false);
    };

    const handleCancelEdit = () => {
        setShowEditExpenseForm(false);
        setExpenseToEdit(null);
    };

    if (isLoadingSelectedGroup && !selectedGroup && !selectedGroupError) {
        return <div className={styles.loadingMessage}>Loading group details...</div>;
    }

    if (selectedGroupError && !isLoadingSelectedGroup && !selectedGroup) {
        return <div className={styles.errorMessage}>Error: {selectedGroupError}</div>;
    }

    if (!selectedGroup && !isLoadingSelectedGroup && !selectedGroupError) {
        return <div className={styles.notFoundMessage}>Group not found or data is unavailable.</div>;
    }

    if (!selectedGroup) {
        return <div className={styles.notFoundMessage}>Group data is missing or an unknown error occurred.</div>;
    }

    const isOwner = currentUser?.id === selectedGroup.owner.id;

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
                    <Button onClick={() => {
                        setShowAddExpenseForm(!showAddExpenseForm);
                        setShowEditExpenseForm(false);
                        setExpenseToEdit(null);
                        setShowSettlement(false);
                        useGroupStore.getState().clearSettlementPlan();
                    }}>
                        {showAddExpenseForm ? 'Cancel Adding Expense' : '+ Add Expense'}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleSettleUpClick}
                        isLoading={isLoadingSettlement}
                        disabled={isLoadingSettlement}
                    >
                        {showSettlement ? 'Hide Settlement' : 'Settle Up'}
                    </Button>
                </div>
            </header>

            {showAddExpenseForm && groupId && !showEditExpenseForm && (<section className={styles.addExpenseSection}>
                <AddExpenseForm groupId={groupId} onExpenseAdded={handleExpenseAdded} />
            </section>)}

            {showEditExpenseForm && expenseToEdit && groupId && (
                <section className={styles.editExpenseSection}>
                    <EditExpenseForm
                        groupId={groupId}
                        expenseToEdit={expenseToEdit}
                        onExpenseUpdated={handleExpenseUpdated}
                        onCancel={handleCancelEdit}
                    />
                </section>
            )}

            {showSettlement && !showAddExpenseForm && !showEditExpenseForm && (
                <section className={styles.settlementSection}>
                    <h2 className={styles.sectionTitle}>Settlement Plan</h2>
                    {isLoadingSettlement && <p className={styles.loadingMessage}>Calculating settlement...</p>}
                    {settlementError && <p className={styles.errorMessage}>Error: {settlementError}</p>}
                    {!isLoadingSettlement && !settlementError && settlementPlan.length === 0 && (
                        <p className={styles.noTransactionsMessage}>All debts are settled, or no transactions to settle!</p>
                    )}
                    {!isLoadingSettlement && !settlementError && settlementPlan.length > 0 && (
                        <ul className={styles.settlementList}>
                            {settlementPlan.map((transaction, index) => (
                                <SettlementTransactionItem
                                    key={`${transaction.from_user_username}-${transaction.to_user_username}-${transaction.amount}-${index}`}
                                    transaction={transaction} />
                            ))}
                        </ul>
                    )}
                </section>
            )}

            {isOwner && groupId && (
                <section className={styles.manageMembersSection}>
                    <ManageMembers groupId={groupId} />
                </section>
            )}

            <section className={styles.expensesSection}>
                <h2 className={styles.sectionTitle}>Expenses</h2>
                {deleteExpenseError && <p className={styles.errorMessage}> Delete error: {deleteExpenseError}</p>}
                {selectedGroupExpenses.length === 0 ? (
                    <p className={styles.noExpensesMessage}>
                        No expenses recorded in this group yet.
                    </p>
                ) : (
                    <div className={styles.expensesList}>
                        {selectedGroupExpenses.map((expense) => (
                            <ExpenseItem
                                key={expense.id}
                                expense={expense}
                                onEdit={handleEditExpenseClick}
                                onDelete={handleDeleteExpenseClick}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default GroupDetailPage;