import React from 'react';
import type { SettlementTransaction } from '../../types/Settlement';
import styles from './SettlementTransactionItem.module.css';


interface SettlementTransactionItemProps {
    transaction: SettlementTransaction;
}

const SettlementTransactionItem: React.FC<SettlementTransactionItemProps> = ({ transaction }) => {
    return (
        <li className={styles.transactionItem}>
            <span className={styles.payer}>{transaction.from_user_username}</span>
            <span className={styles.arrow}>→</span>
            <span className={styles.payee}>{transaction.to_user_username}</span>
            <span className={styles.amount}>{parseFloat(transaction.amount).toFixed(2)} RON</span>
        </li>
    );
};

export default SettlementTransactionItem;
