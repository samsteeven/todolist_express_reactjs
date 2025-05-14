import React, { useState } from 'react';
import { useTodoStore } from '../stores/todoStore';
import { FaPlus } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TodoForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reminderDate, setReminderDate] = useState<Date | null>(null);
    const { addTodo, isLoading } = useTodoStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        await addTodo(
            title,
            description,
            reminderDate ? reminderDate.toISOString() : undefined
        );
        setTitle('');
        setDescription('');
        setReminderDate(null);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 mb-2">
                    Titre*
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Qu'avez-vous à faire ?"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Détails de la tâche (optionnel)"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="reminderDate" className="block text-gray-700 mb-2">
                    Date de rappel (optionnel)
                </label>
                <DatePicker
                    id="reminderDate"
                    selected={reminderDate}
                    onChange={(date: Date) => setReminderDate(date)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholderText="Sélectionnez une date de rappel"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    minDate={new Date()}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
            >
                <FaPlus />
                {isLoading ? 'Ajout en cours...' : 'Ajouter la tâche'}
            </button>
        </form>
    );
};

export default TodoForm;
