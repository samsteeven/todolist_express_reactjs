const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please provide a username'],
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: String,
        verificationTokenExpires: Date,

    },
    { timestamps: true }
);

// Middleware pour hacher le mot de passe avant de sauvegarder
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Méthode pour comparer les mots de passe
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);