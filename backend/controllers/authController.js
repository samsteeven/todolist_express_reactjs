const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {sendVerificationEmail} = require('../utils/emailService');


// Générer un JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Inscrire un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({message: 'Cet utilisateur existe déjà'});
        }

        // Générer un token de vérification
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = new Date();
        tokenExpiration.setHours(tokenExpiration.getHours() + 25); // Expiration après 24h

        // Créer un nouvel utilisateur
        const user = await User.create({
            username,
            email,
            password,
            verificationToken,
            verificationTokenExpires: tokenExpiration,
            isVerified: false
        });
        try {
            // Tentative d'envoi d'email, mais ne bloque pas si ça échoue
            await sendVerificationEmail(email, verificationToken);
            console.log('Email de vérification envoyé');
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email:', emailError);
            // Ne pas renvoyer d'erreur, continuer le processus
        }

        // Dans un environnement de développement, affichez le lien de vérification
        if (process.env.NODE_ENV === 'development') {
            console.log(`Lien de vérification: ${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`);
        }


        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
                token: generateToken(user._id),
                message: 'Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.'
            });
        } else {
            res.status(400).json({message: 'Données utilisateur invalides'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @desc    Authentifier un utilisateur et obtenir un token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({email}).select('+password');
        if (!user) {
            return res.status(401).json({message: 'Email ou mot de passe incorrect'});
        }
        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        // Vérifier si le compte est vérifié
        if (!user.isVerified) {
            return res.status(401).json({
                message: 'Veuillez vérifier votre email avant de vous connecter',
                needsVerification: true
            });
        }

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @desc    Obtenir les données de l'utilisateur connecté
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
            });
        } else {
            res.status(404).json({message: 'Utilisateur non trouvé'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const verifyEmail = async (req, res) => {
    try {
        const {token} = req.params;
        // Trouver l'utilisateur avec ce token
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: {$gt: new Date()}
        });

        if (!user) {
            return res.status(400).json({message: 'Le lien de vérification est invalide ou a expiré'});
        }

        // Activer le compte
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({message: 'Votre compte a été vérifié avec succès, vous pouvez maintenant vous connecter'});
    } catch (error) {
        res.status(500).json({message: 'Erreur lors de la vérification', error: error.message});
    }
}
// Renvoyer l'email de vérification
resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Trouver l'utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Cet utilisateur est déjà vérifié' });
        }

        // Générer un nouveau token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = new Date();
        tokenExpiration.setHours(tokenExpiration.getHours() + 24);

        // Mettre à jour l'utilisateur
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = tokenExpiration;
        await user.save();

        // Envoyer l'email
        await sendVerificationEmail(email, verificationToken);

        res.status(200).json({ message: 'Un nouvel email de vérification a été envoyé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email', error: error.message });
    }
};


module.exports = {registerUser, loginUser, getUserProfile, resendVerificationEmail, verifyEmail};