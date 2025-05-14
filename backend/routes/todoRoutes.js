const express = require('express');
const router = express.Router();
const {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo,
    toggleFavorite, getSentReminders
} = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

// Protéger toutes les routes
router.use(protect);

// Routes CRUD
router.route('/')
    .post(createTodo)
    .get(getTodos);

router.get('/sent-reminders', protect, getSentReminders);

router.route('/:id')
    .get(getTodoById)
    .put(updateTodo)
    .delete(deleteTodo);

// Route pour marquer comme favori
router.put('/:id/favorite', toggleFavorite);

module.exports = router;