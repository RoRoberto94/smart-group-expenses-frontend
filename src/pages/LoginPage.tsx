import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { useAuthStore } from '../store/authStore';
import styles from './AuthPages.module.css';
import { useLocation } from 'react-router-dom';


const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);
    const error = useAuthStore((state) => state.error);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const clearError = useAuthStore((state) => state.clearError);

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    useEffect(() => {
        clearError();
        return () => {
            clearError();
        };
    }, [clearError]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await login({ username, password });
    };


    return (
        <div className={styles.authContainer}>
            <h1 className={styles.title}>Login</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Username"
                    type="text"
                    id="login-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />
                {error && <p data-testid="login-error-message" className={styles.errorMessage}>{error}</p>}
                <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                    Login
                </Button>
            </form>
            <p className={styles.redirectLink}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default LoginPage;