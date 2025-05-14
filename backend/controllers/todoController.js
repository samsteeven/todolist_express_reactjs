const Todo = require('../models/Todo');

/**
 * Gestionnaire d'erreurs commun pour les opérations de todos
 */
const handleError = (res, error) => {
    console.error('Erreur:', error.message);
    res.status(500).json({ message: error.message });
};

/**
 * Récupère une todo par ID et vérifie les autorisations
 * @returns {Object} Résultat contenant la todo et un message d'erreur si applicable
 */
const findTodoAndCheckPermission = async (todoId, userId) => {
    const todo = await Todo.findById(todoId);

    if (!todo) {
        return { error: { status: 404, message: 'Todo non trouvée' } };
    }

    if (todo.user.toString() !== userId.toString()) {
        return { error: { status: 401, message: 'Non autorisé' } };
    }

    return { todo };
};

// @desc    Créer une nouvelle todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
    try {
        const { title, description, reminderDate } = req.body;
        const todo = await Todo.create({
            title,
            description,
            reminderDate,
            user: req.user._id,
        });
        res.status(201).json(todo);
    } catch (error) {
        handleError(res, error);
    }
};

// @desc    Obtenir toutes les todos de l'utilisateur connecté
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        handleError(res, error);
    }
};

// @desc    Obtenir une todo par son ID
// @route   GET /api/todos/:id
// @access  Private
const getTodoById = async (req, res) => {
    try {
        const { todo, error } = await findTodoAndCheckPermission(req.params.id, req.user._id);

        if (error) {
            return res.status(error.status).json({ message: error.message });
        }

        res.json(todo);
    } catch (error) {
        handleError(res, error);
    }
};

// @desc    Mettre à jour une todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
    try {
        const { title, description, completed, favorite, reminderDate } = req.body;
        const { todo, error } = await findTodoAndCheckPermission(req.params.id, req.user._id);

        if (error) {
            return res.status(error.status).json({ message: error.message });
        }

        // Mettre à jour les champs
        todo.title = title || todo.title;
        todo.description = description !== undefined ? description : todo.description;
        todo.completed = completed !== undefined ? completed : todo.completed;
        todo.favorite = favorite !== undefined ? favorite : todo.favorite;
        todo.reminderDate = reminderDate !== undefined ? reminderDate : todo.reminderDate;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (error) {
        handleError(res, error);
    }
};

// @desc    Supprimer une todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
    try {
        const { todo, error } = await findTodoAndCheckPermission(req.params.id, req.user._id);

        if (error) {
            return res.status(error.status).json({ message: error.message });
        }

        await Todo.deleteOne({ _id: todo._id });
        res.json({ message: 'Todo supprimée' });
    } catch (error) {
        handleError(res, error);
    }
};

// @desc    Marquer/démarquer une todo comme favorite
// @route   PUT /api/todos/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
    try {
        const { todo, error } = await findTodoAndCheckPermission(req.params.id, req.user._id);

        if (error) {
            return res.status(error.status).json({ message: error.message });
        }

        // Inverser l'état de favori
        todo.favorite = !todo.favorite;
        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (error) {
        handleError(res, error);
    }
};

// @desc    Récupérer les todos dont les rappels ont été envoyés récemment
// @route   GET /api/todos/sent-reminders
// @access  Private
const getSentReminders = async (req, res) => {
    try {
        // Récupérer les todos de l'utilisateur dont les rappels ont été envoyés
        // dans les dernières 24 heures
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const todos = await Todo.find({
            user: req.user._id,
            reminderSent: true,
            updatedAt: { $gte: oneDayAgo }
        });

        res.json({
            sentReminders: todos.map(todo => todo._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo,
    toggleFavorite,
    getSentReminders
};