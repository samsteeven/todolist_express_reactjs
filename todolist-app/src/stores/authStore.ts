import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

type User = {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    token: string;
};

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    needsVerification: boolean;

    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    resendVerificationEmail: (email: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            needsVerification: false,

            login: async (email, password) => {
                set({ isLoading: true, error: null, needsVerification: false });
                try {
                    const response = await api.post('/api/auth/login', { email, password });
                    set({
                        user: response.data,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                } catch (error: any) {
                    // Vérifier si l'erreur indique que l'email doit être vérifié
                    if (error.response?.data?.needsVerification) {
                        set({
                            isLoading: false,
                            error: error.response.data.message,
                            needsVerification: true,
                            isAuthenticated: false,
                            user: null
                        });
                    } else {
                        set({
                            isLoading: false,
                            error: error.response?.data?.message || 'Erreur de connexion',
                            isAuthenticated: false,
                            user: null
                        });
                    }

                }
            },

            register: async (username, email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/api/auth/register', { username, email, password });
                    set({
                        user: response.data,
                        isAuthenticated: true,
                        isLoading: false,
                        needsVerification: true,
                        error: null
                    });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || "Erreur lors de l'inscription",
                        isLoading: false
                    });
                }
            },

            logout: () => {
                set({ user: null, isAuthenticated: false, needsVerification: false, error: null });
            },

            clearError: () => {
                set({ error: null });
            },

            resendVerificationEmail: async (email) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post('/api/auth/resend-verification', { email });
                    set({ isLoading: false, error: null });
                    return Promise.resolve();
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email'
                    });
                    return Promise.reject(error);
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
