// src/services/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use(
    (config) => {
        const storedAuth = localStorage.getItem('auth-storage');
        if (storedAuth) {
            try {
                const { state } = JSON.parse(storedAuth);
                if (state.user?.token) {
                    config.headers.Authorization = `Bearer ${state.user.token}`;
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du token:', error);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;