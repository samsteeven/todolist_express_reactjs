import { useEffect, useState } from 'react';
import { useTodoStore } from '../stores/todoStore';
import { useAuthStore } from '../stores/authStore';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import { FaSignOutAlt, FaUser, FaCheckCircle, FaClock, FaStar, FaTasks } from 'react-icons/fa';
import ReminderNotification from "../components/ReminderNotification.tsx";

const HomePage = () => {
    const { todos, fetchTodos, isLoading, error } = useTodoStore();
    const { user, logout } = useAuthStore();
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'favorites'>('all');

    useEffect(() => {
        fetchTodos().then(r => console.log(r));
    }, [fetchTodos]);

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        if (filter === 'favorites') return todo.favorite;
        return true;
    });

    // Statistiques
    const totalTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.completed).length;
    const activeTodos = todos.filter(todo => !todo.completed).length;
    const favoriteTodos = todos.filter(todo => todo.favorite).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header avec dégradé */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <h1 className="text-2xl font-bold">TodoMaster</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center bg-white/20 px-4 py-2 rounded-lg">
                                <FaUser className="mr-2 text-blue-100" />
                                <span className="font-medium text-white">{user?.username}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                <FaSignOutAlt className="mr-2" />
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <ReminderNotification />

            <main className="container mx-auto px-4 py-8">
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
                        <div className="rounded-full bg-blue-100 p-3 mr-4">
                            <FaTasks className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total des tâches</p>
                            <p className="text-2xl font-bold text-gray-800">{totalTodos}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
                        <div className="rounded-full bg-green-100 p-3 mr-4">
                            <FaCheckCircle className="text-green-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tâches terminées</p>
                            <p className="text-2xl font-bold text-gray-800">{completedTodos}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
                        <div className="rounded-full bg-amber-100 p-3 mr-4">
                            <FaClock className="text-amber-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">En cours</p>
                            <p className="text-2xl font-bold text-gray-800">{activeTodos}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
                        <div className="rounded-full bg-purple-100 p-3 mr-4">
                            <FaStar className="text-purple-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Favorites</p>
                            <p className="text-2xl font-bold text-gray-800">{favoriteTodos}</p>
                        </div>
                    </div>
                </div>

                {/* Formulaire d'ajout de tâche */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Ajouter une nouvelle tâche
                    </h2>
                    <TodoForm />
                </div>

                {/* Liste des tâches */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Mes tâches</h2>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`flex items-center px-4 py-2 rounded-lg ${
                                    filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } transition-all duration-200`}
                            >
                                <FaTasks className="mr-2" />
                                Toutes
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`flex items-center px-4 py-2 rounded-lg ${
                                    filter === 'active'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } transition-all duration-200`}
                            >
                                <FaClock className="mr-2" />
                                En cours
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`flex items-center px-4 py-2 rounded-lg ${
                                    filter === 'completed'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } transition-all duration-200`}
                            >
                                <FaCheckCircle className="mr-2" />
                                Terminées
                            </button>
                            <button
                                onClick={() => setFilter('favorites')}
                                className={`flex items-center px-4 py-2 rounded-lg ${
                                    filter === 'favorites'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } transition-all duration-200`}
                            >
                                <FaStar className="mr-2" />
                                Favorites
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center text-sm mb-4">
                            <div className="mr-3 bg-red-100 p-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center h-60">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full absolute border-4 border-blue-200"></div>
                                <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-blue-600 border-t-transparent"></div>
                            </div>
                        </div>
                    ) : filteredTodos.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-500 text-lg">Aucune tâche trouvée</p>
                            <p className="text-gray-400 text-sm mt-1">
                                {filter === 'all'
                                    ? "Commencez par ajouter une nouvelle tâche ci-dessus"
                                    : filter === 'active'
                                        ? "Vous n'avez pas de tâches en cours"
                                        : filter === 'completed'
                                            ? "Vous n'avez pas de tâches terminées"
                                            : "Vous n'avez pas de tâches favorites"}
                            </p>
                        </div>
                    ) : (
                        <TodoList todos={filteredTodos} />
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t py-6 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} TodoMaster - Votre gestionnaire de tâches</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
