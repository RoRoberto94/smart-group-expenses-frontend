import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';

interface AppInitializerProps {
    children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
    const loadUser = useAuthStore((state) => state.loadUserFromToken);
    const accessToken = useAuthStore((state) => state.accessToken);
    const setTokensCalled = useAuthStore((state) => !!state.accessToken);

    const hasInitialized = useRef(false);


    useEffect(() => {
        if (setTokensCalled && !hasInitialized.current) {
            loadUser();
            hasInitialized.current = true;
        } else if (!accessToken && !hasInitialized.current && !useAuthStore.getState().isLoading) {
            hasInitialized.current = true;
        }
    },[loadUser, accessToken, setTokensCalled]);

    const isLoadingInitial = useAuthStore((state) => state.isLoading && !state.user && !!state.accessToken);
    if (isLoadingInitial && hasInitialized.current === false) {
        return <div>Loading application state...</div>
    }

    return <>{children}</>
};

export default AppInitializer;