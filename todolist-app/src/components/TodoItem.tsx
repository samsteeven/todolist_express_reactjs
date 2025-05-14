import React, {useState, useEffect} from 'react';
import {Todo} from '../utils';
import {useTodoStore} from '../stores/todoStore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {format} from 'date-fns';
import {
    FaBell,
    FaCheck,
    FaRegBell,
    FaStar,
    FaRegStar,
    FaTrash,
    FaEdit,
    FaClock,
    FaExclamationCircle,
    FaSync
} from 'react-icons/fa';
import api from '../services/api';

interface TodoItemProps {
    todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({todo}) => {
    const {updateTodo, deleteTodo, toggleFavorite, setReminder, fetchTodos} = useTodoStore();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description);
    const [showReminderPicker, setShowReminderPicker] = useState(false);
    const [reminderDate, setReminderDate] = useState<Date | null>(
        todo.reminderDate ? new Date(todo.reminderDate) : null
    );
    const [currentTodo, setCurrentTodo] = useState<Todo>(todo);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);

    // Mettre à jour currentTodo quand todo change (via les props)
    useEffect(() => {
        setCurrentTodo(todo);
    }, [todo]);

    // Vérifier périodiquement le statut du rappel si la date est passée et que le rappel n'est pas encore envoyé
    useEffect(() => {
        // Vérifier seulement pour les todos avec date de rappel passée et non envoyée
        if (
            currentTodo.reminderDate &&
            !currentTodo.reminderSent &&
            new Date(currentTodo.reminderDate) < new Date()
        ) {
            const checkReminderStatus = async () => {
                try {
                    setIsCheckingStatus(true);
                    const response = await api.get(`/api/todos/${currentTodo._id}`);
                    if (response.data.reminderSent !== currentTodo.reminderSent) {
                        setCurrentTodo(response.data);
                        // Mettre à jour le store global pour refléter les changements
                        await fetchTodos();
                    }
                    setIsCheckingStatus(false);
                } catch (error) {
                    console.error("Erreur lors de la vérification du statut du rappel:", error);
                    setIsCheckingStatus(false);
                }
            };

            // Vérifier immédiatement une fois
            checkReminderStatus().then(r => console.log("Une erreur est survenue: ", r));

            // Vérifier toutes les 10 secondes
            const intervalId = setInterval(checkReminderStatus, 10000);
            return () => clearInterval(intervalId);
        }
    }, [currentTodo._id, currentTodo.reminderDate, currentTodo.reminderSent, fetchTodos]);

    const handleComplete = () => {
        updateTodo(currentTodo._id, {completed: !currentTodo.completed}).then(() => {
            setCurrentTodo({...currentTodo, completed: !currentTodo.completed});
        });
    };

    const handleFavorite = () => {
        toggleFavorite(currentTodo._id).then(() => {
            setCurrentTodo({...currentTodo, favorite: !currentTodo.favorite});
        });
    };

    const handleDelete = () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            deleteTodo(currentTodo._id).then((r) =>  console.log("Une erreur est survenue: ", r));
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        updateTodo(currentTodo._id, {title, description}).then(() => {
            setCurrentTodo({...currentTodo, title, description});
            setIsEditing(false);
        });
    };

    const handleCancel = () => {
        setTitle(currentTodo.title);
        setDescription(currentTodo.description);
        setIsEditing(false);
    };

    const handleReminderToggle = () => {
        setShowReminderPicker(!showReminderPicker);
    };

    const handleReminderSet = (date: Date | null) => {
        if (date) {
            setReminderDate(date);
            setReminder(currentTodo._id, date.toISOString()).then(() => {
                setCurrentTodo({...currentTodo, reminderDate: date.toISOString(), reminderSent: false});
                setShowReminderPicker(false);
            });
        }
    };

    const handleReminderRemove = () => {
        updateTodo(currentTodo._id, {reminderDate: null}).then(() => {
            setCurrentTodo({...currentTodo, reminderDate: null, reminderSent: false});
            setReminderDate(null);
            setShowReminderPicker(false);
        });
    };

    // Fonction pour vérifier manuellement le statut du rappel
    const handleCheckReminderStatus = async () => {
        try {
            setIsCheckingStatus(true);
            const response = await api.get(`/api/todos/${currentTodo._id}`);
            setCurrentTodo(response.data);
            // Mettre à jour l'ensemble des todos
            await fetchTodos();
            setIsCheckingStatus(false);
        } catch (error) {
            console.error("Erreur lors de la vérification du statut du rappel:", error);
            setIsCheckingStatus(false);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mb-4 p-2 border rounded"
                    rows={3}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={handleCancel} className="px-3 py-1 bg-gray-200 rounded">
                        Annuler
                    </button>
                    <button onClick={handleSave} className="px-3 py-1 bg-green-500 text-white rounded">
                        Enregistrer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white p-4 rounded-lg shadow mb-4 ${currentTodo.completed ? 'opacity-70' : ''}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={currentTodo.completed}
                            onChange={handleComplete}
                            className="mr-2 h-5 w-5"
                        />
                        <h3 className={`text-lg font-semibold ${currentTodo.completed ? 'line-through text-gray-500' : ''}`}>
                            {currentTodo.title}
                        </h3>
                    </div>
                    {currentTodo.description && <p className="text-gray-600 mb-2">{currentTodo.description}</p>}

                    {/* Affichage du statut du rappel */}
                    {currentTodo.reminderDate && (
                        <div
                            className={`flex items-center text-sm ${currentTodo.reminderSent ? 'text-green-600' : 'text-blue-600'} mb-2 p-1 rounded-md ${currentTodo.reminderSent ? 'bg-green-50' : 'bg-blue-50'}`}>
                            <FaBell className="mr-1"/>
                            <span className="flex-1">
                                Rappel: {format(new Date(currentTodo.reminderDate), 'dd/MM/yyyy HH:mm')}
                                {currentTodo.reminderSent ? (
                                    <span className="ml-2 text-green-600 font-medium flex items-center">
                                        <FaCheck className="mr-1"/> Envoyé
                                    </span>
                                ) : (
                                    new Date(currentTodo.reminderDate) < new Date() ? (
                                        <span className="ml-2 text-orange-500 font-medium flex items-center">
                                            <FaExclamationCircle className="mr-1"/> En attente d'envoi
                                            <button
                                                onClick={handleCheckReminderStatus}
                                                disabled={isCheckingStatus}
                                                title="Vérifier le statut"
                                                className="ml-2 text-blue-500 hover:text-blue-700"
                                            >
                                                <FaSync className={`${isCheckingStatus ? 'animate-spin' : ''}`} />
                                            </button>
                                        </span>
                                    ) : (
                                        <span className="ml-2 text-blue-600 font-medium flex items-center">
                                            <FaClock className="mr-1"/> Planifié
                                        </span>
                                    )
                                )}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-start space-x-2">
                    <button onClick={handleReminderToggle} className="text-blue-500 hover:text-blue-700">
                        {currentTodo.reminderDate ? <FaBell/> : <FaRegBell/>}
                    </button>
                    <button onClick={handleFavorite} className="text-yellow-500 hover:text-yellow-700">
                        {currentTodo.favorite ? <FaStar/> : <FaRegStar/>}
                    </button>
                    <button onClick={handleEdit} className="text-blue-500 hover:text-blue-700">
                        <FaEdit/>
                    </button>
                    <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                        <FaTrash/>
                    </button>
                </div>
            </div>

            {showReminderPicker && (
                <div className="mt-4 p-3 border rounded bg-gray-50">
                    <p className="mb-2 font-semibold">Définir un rappel</p>
                    <DatePicker
                        selected={reminderDate}
                        onChange={handleReminderSet}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="dd/MM/yyyy HH:mm"
                        className="p-2 border rounded w-full mb-2"
                        placeholderText="Sélectionnez une date et heure"
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setShowReminderPicker(false)}
                            className="px-3 py-1 bg-gray-200 rounded text-sm"
                        >
                            Annuler
                        </button>
                        {reminderDate && (
                            <button
                                onClick={handleReminderRemove}
                                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                            >
                                Supprimer le rappel
                            </button>
                        )}
                        <button
                            onClick={() => reminderDate && handleReminderSet(reminderDate)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                            disabled={!reminderDate}
                        >
                            Confirmer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoItem;