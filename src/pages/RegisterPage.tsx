import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { useAuthStore } from '../store/authStore';
import styles from './AuthPages.module.css';


const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const register = useAuthStore((state) => state.register);
    const isLoading = useAuthStore((state) => state.isLoading);
    const error = useAuthStore((state) => state.error);

    const clearError = useAuthStore((state) => state.clearError);

    const navigate = useNavigate();


    useEffect(() => {
        clearError();
        return () => {
            clearError();
        };
    }, [clearError]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearError();

        await register({
            username,
            email,
            password,
            password2,
            first_name: firstName,
            last_name: lastName,
        });

        const registrationError = useAuthStore.getState().error;

        if (!registrationError) {
            alert('Registration successful! Please log in.')
            navigate('/login');
        }
    };

    return (
        <div className={styles.authContainer}>
            <h1 className={styles.title}>Register</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Username"
                    type="text"
                    id="reg-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <Input
                    label="Email"
                    type="email"
                    id="reg-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    id="reg-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    id="reg-password2"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <Input
                    label="First Name (Optional)"
                    type="text"
                    id="reg-firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                />
                <Input
                    label="Last Name (Optional)"
                    type="text"
                    id="reg-lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                />
                {error && <p className={styles.errorMessage}>{error}</p>}
                <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                    Register
                </Button>
            </form>
            <p className={styles.redirectLink}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default RegisterPage;