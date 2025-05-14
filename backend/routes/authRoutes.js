const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, verifyEmail, resendVerificationEmail} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Routes publiques
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Routes protégées
router.get('/profile', protect, getUserProfile);

module.exports = router;