import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { FaUser, FaLock, FaEnvelope, FaArrowRight } from 'react-icons/fa';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(username, email, password);
        if (useAuthStore.getState().user?.isVerified) {
            navigate('/');
        }else{
            useAuthStore.getState().logout();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                        <h2 className="text-3xl font-extrabold mb-1">Créer un compte</h2>
                        <p className="text-indigo-100">Rejoignez-nous pour gérer vos tâches</p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center text-sm">
                                <div className="mr-3 bg-red-100 p-1 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                                    Nom d'utilisateur
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                                        placeholder="JohnDoe"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                    Adresse email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                                        placeholder="exemple@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                                        placeholder="Minimum 8 caractères"
                                        required
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Le mot de passe doit contenir au moins 8 caractères
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:from-indigo-700 hover:to-purple-800 transition duration-300 flex items-center justify-center space-x-2"
                            >
                                <span>{isLoading ? 'Création en cours...' : 'Créer mon compte'}</span>
                                {!isLoading && <FaArrowRight className="w-4 h-4" />}
                                {isLoading && (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                            </button>
                        </form>

                        <div className="pt-2 text-center">
                            <p className="text-sm text-gray-600">
                                Déjà un compte ?{' '}
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
