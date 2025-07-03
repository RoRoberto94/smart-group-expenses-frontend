import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    isLoading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children, variant = 'primary', isLoading = false, disabled, className, ...buttonProps
}) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${className || ''}`}
            disabled={disabled || isLoading}
            {...buttonProps}
        >
            {isLoading ? <span className={styles.spinner}></span> : children}
        </button>
    );
};
export default Button;