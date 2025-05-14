import { create } from 'zustand';
import api from '../services/api';

export type Todo = {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    favorite: boolean;
    reminderDate: string | null;
    reminderSent?: boolean;
    createdAt: string;
    updatedAt: string;
};

type TodoState = {
    todos: Todo[];
    isLoading: boolean;
    error: string | null;
    fetchTodos: () => Promise<void>;
    addTodo: (title: string, description: string, reminderDate?: string) => Promise<void>;
    updateTodo: (id: string, data: Partial<Todo>) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    toggleFavorite: (id: string) => Promise<void>;
    setReminder: (id: string, reminderDate: string) => Promise<void>;
    checkSentReminders: () => Promise<void>;
    clearError: () => void;
};

export const useTodoStore = create<TodoState>((set) => ({
    todos: [],
    isLoading: false,
    error: null,

    fetchTodos: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/api/todos');
            set({ todos: response.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erreur lors du chargement des todos',
                isLoading: false
            });
        }
    },

    addTodo: async (title, description, reminderDate) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/api/todos', { title, description, reminderDate });
            set(state => ({
                todos: [response.data, ...state.todos],
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erreur lors de la création de la todo',
                isLoading: false
            });
        }
    },

    updateTodo: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/api/todos/${id}`, data);
            set(state => ({
                todos: state.todos.map(todo => todo._id === id ? response.data : todo),
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erreur lors de la mise à jour de la todo',
                isLoading: false
            });
        }
    },

    deleteTodo: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/api/todos/${id}`);
            set(state => ({
                todos: state.todos.filter(todo => todo._id !== id),
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erreur lors de la suppression de la todo',
                isLoading: false
            });
        }
    },

    toggleFavorite: async (id) => {
        try {
            const response = await api.put(`/api/todos/${id}/favorite`);
            set(state => ({
                todos: state.todos.map(todo => todo._id === id ? response.data : todo)
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erreur lors du changement de statut favori'
            });
        }
    },

    setReminder: async (id, reminderDate) => {
        try {
            await api.post('/api/reminders', { todoId: id, reminderDate });
            set(state => ({
                todos: state.todos.map(todo =>
                    todo._id === id ? { ...todo, reminderDate } : todo
                )
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erreur lors de la définition du rappel'
            });
        }
    },

    checkSentReminders: async () => {
        try {
            const response = await api.get('/api/todos/sent-reminders');
            set(state => ({
                todos: state.todos.map(todo =>
                    response.data.sentReminders.includes(todo._id)
                        ? { ...todo, reminderSent: true }
                        : todo
                )
            }));
        } catch (error: any) {
            console.error("Erreur lors de la vérification des rappels envoyés:", error);
        }
    },


    clearError: () => {
        set({ error: null });
    }
}));
