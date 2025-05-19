import { createBrowserRouter, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import GroupDetailPage from '../pages/GroupDetailPage';
import NotFoundPage from '../pages/NotFoundPage';


export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
            {
                path: '/register',
                element: <RegisterPage />,
            },
        ],
    },
    {
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <DashboardPage />,
            },
            {
                path: '/dashboard',
                element: <DashboardPage />,
            },
            {
                path: '/groups/:groupId',
                element: <GroupDetailPage />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);