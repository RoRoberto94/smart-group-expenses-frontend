import React, { useState, useRef, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import styles from './Navbar.module.css'; // Vom crea acest fișier
import Button from '../Button/Button';
import useOnClickOutside from '../../hooks/useOnClickOutside';


const Navbar: React.FC = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

    useOnClickOutside([mobileMenuRef, hamburgerButtonRef] as React.RefObject<HTMLElement>[], () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContent}>
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

                <ul className={`${styles.navLinks} ${styles.desktopNav}`}>
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

                <button
                    ref={hamburgerButtonRef}
                    className={styles.hamburgerButton}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>
            </div>

            {isMobileMenuOpen && (
                <div ref={mobileMenuRef} className={styles.mobileMenu}>
                    <ul className={styles.mobileNavLinks}>
                        {isAuthenticated ? (
                            <>
                                {user && (
                                    <li className={styles.mobileUserInfo}>
                                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Hi, {user.username}!</Link>
                                    </li>
                                )}
                                <li><Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link></li>
                                <li>
                                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className={styles.mobileLogoutButton}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link></li>
                                <li><Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;