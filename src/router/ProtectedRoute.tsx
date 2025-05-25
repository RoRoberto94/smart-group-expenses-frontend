import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';


const ProtectedRoute: React.FC = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const accessToken = useAuthStore((state) => state.accessToken);
    const isLoadingAuth = useAuthStore((state) => state.isLoading);

    const location = useLocation();

    if (isLoadingAuth && accessToken) {
        return <div>Checking authentication status...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <Outlet />;
};

export default ProtectedRoute;