import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import styles from './Navbar.module.css'; // Vom crea acest fișier
import Button from '../Button/Button';


const Navbar: React.FC = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.leftNavItems}>
                <div className={styles.navBrand}>
                    <Link to={isAuthenticated ? "/dashboard" : "/login"}>SmartGroupExpenses</Link>
                </div>
                {isAuthenticated && (
                    <>
                        <span className={styles.separator}></span>
                        <div className={styles.pageTitle}>
                            <Link to="/dashboard">Dashboard</Link>
                        </div>
                    </>
                )}
            </div>

            <div className={styles.navSpacer}></div>

            <ul className={styles.navLinks}>
                {isAuthenticated ? (
                    <>
                        {user && (
                            <li className={styles.userInfo}>
                                <Link to="/profile">Hi, {user.username}!</Link>
                            </li>
                        )}
                        <li>
                            <Button onClick={handleLogout} variant="secondary" className={styles.logoutButton}>
                                Logout
                            </Button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;