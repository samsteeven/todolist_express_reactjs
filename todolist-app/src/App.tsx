// App.tsx (mise à jour)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/ResgisterPage.tsx';
import VerifyEmailPage from './pages/VerifyEmailPage';
import React from "react";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user } = useAuthStore();

    // Si l'authentification est en cours, afficher un indicateur de chargement
    // Cela évite les redirections prématurées
    /*if (isLoading) {
        return <div>Chargement...</div>;
    }*/

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Vérifier si l'utilisateur a confirmé son email
    if (user && !user.isVerified) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore();

    // Si l'authentification est en cours, afficher un indicateur de chargement
    /*if (isLoading) {
        return <div>Chargement...</div>;
    }*/

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};


function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <HomePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/verify-email"
                    element={
                        <PublicRoute>
                            <VerifyEmailPage />
                        </PublicRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;