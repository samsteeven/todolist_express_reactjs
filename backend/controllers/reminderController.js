const Todo = require('../models/Todo');

// @desc    Envoyer des rappels pour les todos dont la date est arrivée
// @route   GET /api/reminders/send
// @access  Private (idéalement réservé aux admins ou à un CRON job)
const sendReminders = async (req, res) => {
    try {
        // Utiliser le service d'email centralisé au lieu de créer un nouveau transporteur
        const { sendEmail } = require('../utils/emailService');

        // Trouver toutes les todos avec une date de rappel dans le passé et qui n'ont pas encore été envoyées
        const todos = await Todo.find({
            reminderDate: { $lte: new Date() },
            reminderSent: false,
        }).populate('user', 'email username');

        if (todos.length === 0) {
            return res.json({ message: 'Aucun rappel à envoyer' });
        }

        // Pour chaque todo, envoyer un email et marquer comme envoyé
        const sentReminders = [];
        for (const todo of todos) {
            try {
                // Préparer les options d'email
                const emailOptions = {
                    to: (await todo).user.email,
                    subject: `Rappel : ${(await todo).title}`,
                    text: `Bonjour ${(await todo).user.username},\n\nCeci est un rappel pour votre tâche : ${todo.title}.\n\nDescription : ${todo.description || 'Aucune description'}\n\nCordialement,\nVotre application Todo List`,
                    html: `
                        <h2>Rappel pour votre tâche</h2>
                        <h3>${(await todo).title}</h3>
                        <p><strong>Description :</strong> ${(await todo).description || 'Aucune description'}</p>
                        <p>Cordialement,<br>Votre application Todo List</p>
                    `,
                };

                // Envoyer l'email
                await sendEmail(emailOptions);

                // Marquer le rappel comme envoyé
                todo.reminderSent = true;
                await todo.save();
                sentReminders.push(todo._id);
            } catch (error) {
                console.error(`Erreur lors de l'envoi du rappel pour la todo ${todo._id}:`, error);
            }
        }

        res.json({
            message: `${sentReminders.length} rappels envoyés`,
            reminders: sentReminders,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Planifier un rappel pour une todo
// @route   POST /api/reminders
// @access  Private
const scheduleReminder = async (req, res) => {
    try {
        const { todoId, reminderDate } = req.body;

        // Vérifier si la date est valide
        const date = new Date(reminderDate);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ message: 'Date de rappel invalide' });
        }

        // Trouver la todo
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Todo non trouvée' });
        }

        // Vérifier si l'utilisateur est le propriétaire
        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Non autorisé' });
        }

        // Mettre à jour la date de rappel
        todo.reminderDate = date;
        todo.reminderSent = false;
        const updatedTodo = await todo.save();

        res.json({
            message: 'Rappel planifié',
            todo: updatedTodo,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendReminders, scheduleReminder };