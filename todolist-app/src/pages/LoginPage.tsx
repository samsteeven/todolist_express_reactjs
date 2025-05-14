// pages/LoginPage.tsx (mise à jour)
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { FaUser, FaLock, FaArrowRight, FaEnvelope } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');
  const { login, isLoading, error, needsVerification, resendVerificationEmail } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    if (useAuthStore.getState().isAuthenticated) {
      navigate('/');
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      setResendStatus('error');
      setResendMessage('Veuillez entrer votre adresse email.');
      return;
    }

    setResendStatus('loading');
    try {
      await resendVerificationEmail(resendEmail);
      setResendStatus('success');
      setResendMessage('Un nouvel email de vérification a été envoyé.');
    } catch (error) {
      setResendStatus('error');
      setResendMessage('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <h2 className="text-3xl font-extrabold mb-1">Bienvenue</h2>
              <p className="text-blue-100">Connectez-vous pour accéder à votre espace</p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
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

              {needsVerification ? (
                  <div className="space-y-5">
                    <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-200">
                      <h3 className="font-bold text-lg mb-2 flex items-center">
                        <FaEnvelope className="mr-2" /> Vérification d'email requise
                      </h3>
                      <p className="mb-3">
                        Votre compte n'a pas encore été vérifié. Veuillez vérifier votre boîte de réception et cliquer sur le lien dans l'email de vérification.
                      </p>
                      <p className="text-sm">
                        Vous n'avez pas reçu l'email ? Entrez votre adresse email ci-dessous pour recevoir un nouveau lien.
                      </p>
                    </div>

                    <form onSubmit={handleResendVerification} className="space-y-4">
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-gray-400" />
                          </div>
                          <input
                              type="email"
                              value={resendEmail}
                              onChange={(e) => setResendEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                              placeholder="exemple@email.com"
                              required
                          />
                        </div>
                      </div>

                      {resendStatus === 'success' && (
                          <div className="bg-green-50 text-green-700 p-3 rounded-lg">
                            {resendMessage}
                          </div>
                      )}

                      {resendStatus === 'error' && (
                          <div className="bg-red-50 text-red-700 p-3 rounded-lg">
                            {resendMessage}
                          </div>
                      )}

                      <button
                          type="submit"
                          disabled={resendStatus === 'loading'}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:from-blue-700 hover:to-indigo-800 transition duration-300 flex items-center justify-center"
                      >
                        {resendStatus === 'loading' ? (
                            <>
                              <span>Envoi en cours...</span>
                              <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </>
                        ) : (
                            'Renvoyer l\'email de vérification'
                        )}
                      </button>

                      <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={() => useAuthStore.setState({ needsVerification: false, error: null })}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Retour à la connexion
                        </button>
                      </div>
                    </form>
                  </div>
              ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        Adresse email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                            placeholder="exemple@email.com"
                            required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                          Mot de passe
                        </label>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                            placeholder="••••••••"
                            required
                        />
                      </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:from-blue-700 hover:to-indigo-800 transition duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>{isLoading ? 'Connexion en cours...' : 'Se connecter'}</span>
                      {!isLoading && <FaArrowRight className="w-4 h-4" />}
                      {isLoading && (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                      )}
                    </button>
                  </form>
              )}

              <div className="pt-2 text-center">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;