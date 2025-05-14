// utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration du transporteur
let transporter;

// Initialiser le transporteur avec des logs
const initTransporter = () => {
    console.log('Initialisation du transporteur email avec les paramètres suivants:');
    console.log(`- Service: ${process.env.EMAIL_SERVICE}`);
    console.log(`- Username: ${process.env.EMAIL_USERNAME}`);
    console.log(`- Password: ${process.env.EMAIL_PASSWORD ? '******' : 'Non défini'}`);

    transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

// Appeler l'initialisation
initTransporter();

// Fonction générique pour envoyer des emails
const sendEmail = async (options) => {
    try {
        console.log(`Tentative d'envoi d'email à ${options.to}...`);

        // Si le transporteur n'est pas initialisé, le faire maintenant
        if (!transporter) {
            initTransporter();
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email envoyé avec succès à ${options.to}. ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        throw error;
    }
};

// Fonction spécifique pour l'email de vérification
const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    return sendEmail({
        to: email,
        subject: 'Vérification de votre adresse email',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Vérification de votre compte</h2>
        <p>Merci de vous être inscrit ! Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Vérifier mon email</a>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
      </div>
    `,
    });
};

// Fonction pour envoyer des rappels
const sendReminderEmail = async (email, todo) => {
    return sendEmail({
        to: email,
        subject: `Rappel: ${todo.title}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Rappel de tâche</h2>
        <p>N'oubliez pas votre tâche :</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin-top: 0;">${todo.title}</h3>
          <p>${todo.description || 'Pas de description'}</p>
          <p>Date d'échéance: ${new Date(todo.reminderDate).toLocaleDateString()}</p>
        </div>
      </div>
    `,
    });
};

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendReminderEmail
};