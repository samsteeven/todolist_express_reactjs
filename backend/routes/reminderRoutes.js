const express = require('express');
const router = express.Router();
const { sendReminders, scheduleReminder } = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

// Route protégée
router.post('/', protect, scheduleReminder);

// Dans un environnement de production, cette route devrait être appelée par un CRON job
router.get('/send', sendReminders);

module.exports = router;