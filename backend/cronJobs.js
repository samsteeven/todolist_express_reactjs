const cron = require('node-cron');
const reminderController = require('./controllers/reminderController');

// Configurer la tâche cron pour exécuter sendReminders
// Cette tâche s'exécutera toutes les 2 minutes
const scheduledReminderTask = cron.schedule('*/2 * * * *', async () => {
  console.log('Exécution de la tâche planifiée d\'envoi des rappels:', new Date().toISOString());
  try {
    // Créer un objet factice pour simuler req et res
    const req = {};
    const res = {
      json: (data) => console.log('Rappels envoyés:', data),
      status: (code) => ({
        json: (data) => console.error(`Erreur (${code}):`, data)
      })
    };
    
    await reminderController.sendReminders(req, res);
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la tâche planifiée:', error);
  }
});

// Démarrer toutes les tâches planifiées
const startCronJobs = () => {
  scheduledReminderTask.start();
  console.log('Tâches cron démarrées avec succès');
};

module.exports = { startCronJobs };