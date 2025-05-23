import React from 'react';
import styles from './Input.module.css';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, ...inputProps }) => {
    const inputId = id || inputProps.name || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={styles.inputGroup}>
            {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
            <input id={inputId}
                className={`${styles.inputField} ${error ? styles.inputError : ''}`}
                {...inputProps}
            />
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default Input;