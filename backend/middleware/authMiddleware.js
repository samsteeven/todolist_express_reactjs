// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Récupérer le token
            token = req.headers.authorization.split(' ')[1];

            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Récupérer l'utilisateur
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }

            // Vérifier si l'utilisateur a confirmé son email
            if (!user.isVerified) {
                return res.status(403).json({
                    message: 'Veuillez vérifier votre email avant d\'accéder à cette ressource',
                    needsVerification: true
                });
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Non autorisé, token invalide' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
    }
};

module.exports = { protect };