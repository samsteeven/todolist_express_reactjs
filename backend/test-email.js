// test-email.js
require('dotenv').config();
const { sendEmail, sendVerificationEmail } = require('./utils/emailService');

const testEmail = async () => {
  try {
    console.log('Démarrage du test d\'envoi d\'email...');
    
    // Afficher les variables d'environnement (masquées)
    console.log('Variables d\'environnement:');
    console.log(`EMAIL_SERVICE: ${process.env.EMAIL_SERVICE || 'Non défini'}`);
    console.log(`EMAIL_USERNAME: ${process.env.EMAIL_USERNAME || 'Non défini'}`);
    console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '******' : 'Non défini'}`);
    console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || 'Non défini'}`);
    
    const result = await sendEmail({
      to: 'votre-email-test@example.com', // Remplacez par votre email
      subject: 'Test d\'envoi d\'email',
      html: '<h1>Ceci est un test</h1><p>Si vous recevez cet email, cela signifie que la configuration fonctionne correctement.</p>',
    });
    const r = await sendVerificationEmail("samendjiaha@gmail.com", "szededededed dede");
    
    console.log('Email envoyé avec succès !');
    console.log('Résultat:', result);
    console.log("Resultat 2" + r)
  } catch (error) {
    console.error('Erreur lors du test d\'envoi d\'email:');
    console.error(error);
  }
};

testEmail().then(r => console.log('Fin du test d\'envoi d\'email.' + r));