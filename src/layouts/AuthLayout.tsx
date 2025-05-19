import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

const AuthLayout = () => {
    return (
        <div className={styles.authLayout}>
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;