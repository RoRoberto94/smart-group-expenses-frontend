import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';

const MainLayout = () => {
    return (
        <div className={styles.mainLayout}>
            <header className={styles.header}>
                Navbar Placeholder (Main Layout)
            </header>
            <main className={styles.content}>
                <Outlet />
            </main>
            <footer className={styles.footer}>
                Footer Placeholder (Main Layout)
            </footer>
        </div>
    );
};

export default MainLayout;