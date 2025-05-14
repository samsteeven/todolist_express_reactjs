import React, { useEffect, useState, useCallback } from 'react';
import { FaBell } from 'react-icons/fa';
import api from '../services/api';

const ReminderNotification: React.FC = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [sentReminders, setSentReminders] = useState<string[]>([]);

    // Utiliser useCallback pour éviter des recréations inutiles de la fonction
    const checkSentReminders = useCallback(async () => {
        try {
            console.log("Vérification des rappels...");
            const response = await api.get('/api/todos/sent-reminders');
            const newSentReminders = response.data.sentReminders || [];

            // Compare les anciennes et nouvelles valeurs sans modifier l'état si pas nécessaire
            if (newSentReminders.length > 0) {
                const hasNewReminders = newSentReminders.some(
                    (id: string) => !sentReminders.includes(id)
                );

                if (hasNewReminders) {
                    console.log("Nouveaux rappels détectés");
                    setShowNotification(true);
                    setSentReminders(newSentReminders);
                }
            }
        } catch (error) {
            console.error("Erreur lors de la vérification des rappels:", error);
        }
    }, [sentReminders]);

    useEffect(() => {
        // Exécuter une seule fois au montage
        const initialCheck = async () => {
            try {
                const response = await api.get('/api/todos/sent-reminders');
                const initialReminders = response.data.sentReminders || [];
                if (initialReminders.length > 0) {
                    setShowNotification(true);
                    setSentReminders(initialReminders);
                }
            } catch (error) {
                console.error("Erreur lors de la vérification initiale des rappels:", error);
            }
        };

        initialCheck();

        // Configurer la vérification périodique des rappels
        const interval = setInterval(() => {
            checkSentReminders();
        }, 2 * 60 * 1000); // Vérifier toutes les 2 minutes

        return () => clearInterval(interval);
    }, []); // Exécuter une seule fois au montage

    if (!showNotification) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4 max-w-xs md:max-w-md z-50">
            <div className="bg-white/20 p-2 rounded-full">
                <FaBell className="text-xl" />
            </div>
            <div className="flex-1">
                <h4 className="font-bold">Rappels envoyés</h4>
                <p className="text-sm">Des rappels pour vos tâches ont été envoyés par email.</p>
            </div>
            <button
                onClick={() => setShowNotification(false)}
                className="p-1 hover:bg-white/20 rounded-full"
            >
                ✕
            </button>
        </div>
    );
};

export default ReminderNotification;