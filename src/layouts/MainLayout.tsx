import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';
import Navbar from '../components/Navbar/Navbar';


const MainLayout = () => {
    return (
        <div className={styles.mainLayout}>
            <Navbar />
            <main className={styles.content}>
                <Outlet />
            </main>
            <footer className={styles.footer}>
                © {new Date().getFullYear()} SmartGroupExpenses
            </footer>
        </div>
    );
};

export default MainLayout;