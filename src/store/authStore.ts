import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthTokens } from '../types/User';
import { loginUser, registerUserService, getUserDetails } from '../services/authService';
import type { RegisterPayload, LoginData } from '../services/authService';
import apiClient from '../services/apiClient';


interface ApiValidationError {
    [key: string]: string[] | string;
}

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
}

export const useAuthStore = create<AuthState>()(persist(
    (set, get) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        clearError: () => set({ error: null }),

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
            } catch (err) {
                let errorMessage = 'Login failed';
                if (err instanceof Error) {
                    errorMessage = err.message;
                }
                if (typeof err === 'object' && err !== null && 'response' in err) {
                    const axiosError = err as { response?: { data?: { detail?: string } } };
                    errorMessage = axiosError.response?.data?.detail || errorMessage;
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
            } catch (err) {
                let formattedError = 'Registration failed.';
                if (typeof err === 'object' && err !== null && 'response' in err) {
                    const axiosError = err as { response?: { data?: ApiValidationError | string }, message?: string };

                    if (axiosError.response?.data) {
                        const errors = axiosError.response.data;
                        if (typeof errors === 'string') {
                            formattedError = errors;
                        } else if (typeof errors === 'object' && errors !== null) {
                            formattedError = Object.keys(errors)
                                .map(key => {
                                    const errorValue = errors[key];
                                    return `${key}: ${Array.isArray(errorValue) ? errorValue.join(', ') : errorValue}`;
                                })
                                .join(' | ');
                        } else if (axiosError.message) {
                            formattedError = axiosError.message;
                        }
                    } else if (axiosError.message) {
                        formattedError = axiosError.message;
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
                    set({ user: userData, isAuthenticated: true, isLoading: false }); // Am scos error:null de aici, e deja sus
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