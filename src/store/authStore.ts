import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AxiosError } from 'axios';
import type { User, AuthTokens } from '../types/User';
import { loginUser, registerUserService, getUserDetails, updateUserProfile } from '../services/authService';
import type { RegisterPayload, LoginData, UpdateProfilePayload } from '../services/authService';
import apiClient from '../services/apiClient';


type ApiErrorResponse = {
    [key: string]: string | string[] | undefined;
} & {
    detail?: string;
};

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (credentials: LoginData) => Promise<void>;
    register: (userData: RegisterPayload) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
    setTokens: (tokens: AuthTokens | null) => void;
    loadUserFromToken: () => Promise<void>;
    clearError: () => void;

    isUpdatingProfile: boolean;
    updateProfileError: string | null;
    updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(persist(
    (set, get) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isUpdatingProfile: false,
        updateProfileError: null,
            
        clearError: () => set({ error: null, updateProfileError: null }),

        login: async (credentials) => {
            set({ isLoading: true, error: null });
            try {
                const tokens = await loginUser(credentials);
                set({
                    accessToken: tokens.access,
                    refreshToken: tokens.refresh,
                    isAuthenticated: true,
                    isLoading: false,
                });
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
                await get().loadUserFromToken();
            } catch (err: unknown) {
                let errorMessage = 'Login failed';
                if (err instanceof AxiosError) {
                    const errorData = err.response?.data as ApiErrorResponse | undefined;
                    errorMessage = errorData?.detail || err.message || errorMessage;
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }
                set({ error: errorMessage, isLoading: false, isAuthenticated: false });
                delete apiClient.defaults.headers.common['Authorization'];
            }
        },

        register: async (userData) => {
            set({ isLoading: true, error: null });
            try {
                await registerUserService(userData);
                set({ isLoading: false });
            } catch (err: unknown) {
                let formattedError = 'Registration failed.';
                if (err instanceof AxiosError) {
                    const errorData = err.response?.data as ApiErrorResponse | string | undefined;
                    if (typeof errorData === 'string') {
                        formattedError = errorData;
                    } else if (typeof errorData === 'object' && errorData !== null) {
                        formattedError = Object.keys(errorData)
                            .map(key => {
                                const errorValue = errorData[key];
                                return `${key}: ${Array.isArray(errorValue) ? errorValue.join(', ') : errorValue}`;
                            })
                            .join(' | ');
                    } else if (err.message) {
                        formattedError = err.message;
                    }
                } else if (err instanceof Error) {
                    formattedError = err.message;
                }
                set({ error: formattedError, isLoading: false });
            }
        },

        logout: () => {
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                error: null,
                updateProfileError: null,
            });
            delete apiClient.defaults.headers.common['Authorization'];
        },

        setUser: (userData) => set({ user: userData }),

        setTokens: (tokens) => {
            set({
                accessToken: tokens?.access || null,
                refreshToken: tokens?.refresh || null,
                isAuthenticated: !!tokens?.access,
            });
            if (tokens?.access) {
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
            } else {
                delete apiClient.defaults.headers.common['Authorization'];
            }
        },

        loadUserFromToken: async () => {
            const token = get().accessToken;
            if (token) {
                set({ isLoading: true, error: null });
                try {
                    const userData = await getUserDetails();
                    set({ user: userData, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    console.error("Failed to load user from token, logging out.", error);
                    get().logout();
                    set({ isLoading: false });
                }
            } else {
                if (get().isAuthenticated || get().user) {
                    get().logout();
                }
            }
        },

        updateProfile: async (payload) => {
            set({ isUpdatingProfile: true, updateProfileError: null });
            try {
                const updatedUser = await updateUserProfile(payload);
                set({ user: updatedUser, isUpdatingProfile: false });
                return true;
            } catch (e: unknown) {
                let errorMessage = 'Failed to update profile';
                if (e instanceof AxiosError) {
                    const errorData = e.response?.data as ApiErrorResponse | string | undefined;
                    if (typeof errorData === 'string') {
                        errorMessage = errorData;
                    } else if (typeof errorData === 'object' && errorData !== null) {
                        errorMessage = Object.keys(errorData)
                            .map(key => `${key}: ${Array.isArray(errorData[key]) ? (errorData[key] as string[]).join(', ') : errorData[key]}`)
                            .join(' | ');
                    } else if (e.message) {
                        errorMessage = e.message;
                    }
                } else if (e instanceof Error) {
                    errorMessage = e.message;
                }
                set({ updateProfileError: errorMessage, isUpdatingProfile: false });
                return false;
            }
        },
    }),
    {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
        }),
        onRehydrateStorage: () => (state) => {
            if (state) {
                state.setTokens({ access: state.accessToken!, refresh: state.refreshToken! });
            }
        }
    }
));