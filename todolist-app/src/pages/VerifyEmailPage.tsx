import {useEffect, useRef, useState} from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import api from '../services/api';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const VerifyEmailPage = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification de votre adresse email...');
  const location = useLocation();
  const verificationAttempted = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {

    const verifyEmail = async () => {
      // Si une vérification a déjà été tentée, ne pas réessayer
      if (verificationAttempted.current) return;

      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Lien de vérification invalide.');
        return;
      }
      try {
        console.log('Tentative de vérification avec token:', token);
        verificationAttempted.current = true; // Marquer comme tenté

        const response = await api.get(`/api/auth/verify/${token}`);
        setStatus('success');
        setMessage(response.data.message);
        console.log(response.data);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        console.log(response.data.message);
        return;
      } catch (error: any) {
        // Si le statut est 200 malgré l'erreur
        if (error.response?.status === 200) {
          setStatus('success');
          setMessage(error.response.data.message || 'Compte vérifié avec succès.');

        } else {
          setStatus('error');
          setMessage(error.response?.data?.message || 'Une erreur est survenue lors de la vérification.');
        }
      }
    };

    verifyEmail().then();
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <h2 className="text-3xl font-extrabold mb-1">Vérification Email</h2>
            <p className="text-blue-100">Activation de votre compte</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-center">
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center py-8">
                <svg className="animate-spin h-12 w-12 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center justify-center py-8">
                <FaCheckCircle className="text-green-500 text-6xl mb-4" />
                <p className="text-gray-700 font-medium mb-6">{message}</p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-medium focus:outline-none hover:from-blue-700 hover:to-indigo-800 transition duration-300"
                >
                  Se connecter
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center justify-center py-8">
                <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
                <p className="text-gray-700 font-medium mb-6">{message}</p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-medium focus:outline-none hover:from-blue-700 hover:to-indigo-800 transition duration-300"
                >
                  Retour à la connexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;