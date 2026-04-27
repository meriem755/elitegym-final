/**
 * Crée les comptes de test dans la BDD.
 * Lancer une seule fois : node utils/init-users.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const USERS = [
  {
    nom: 'Admin', prenom: 'Système',
    telephone: '+213550000001',
    mdp: 'Admin@2026',
    role: 'administrateur',
  },
  {
    nom: 'Benali', prenom: 'Karim',
    telephone: '+213555111222',
    mdp: 'Coach@2026',
    role: 'coach',
  },
  {
    nom: 'Mansouri', prenom: 'Samia',
    telephone: '+213555333444',
    mdp: 'Coach@2026',
    role: 'coach',
  },
  {
    nom: 'Réception', prenom: 'Test',
    telephone: '+213550000002',
    mdp: 'Reception@2026',
    role: 'receptionniste',
  },
  {
    nom: 'Test', prenom: 'Membre',
    telephone: '+213600000000',
    mdp: 'Membre@2026',
    role: 'membre',
  },
];

(async () => {
  console.log('🔧 Initialisation des comptes de test...\n');
  try {
    for (const u of USERS) {
      const hash = await bcrypt.hash(u.mdp, 12);
      await pool.execute(
        `INSERT INTO utilisateur (nom, prenom, telephone, mot_de_passe, role, statut, date_creation)
         VALUES (?, ?, ?, ?, ?, 1, NOW())
         ON DUPLICATE KEY UPDATE mot_de_passe = VALUES(mot_de_passe), statut = 1`,
        [u.nom, u.prenom, u.telephone, hash, u.role]
      );
      console.log(`✅ [${u.role.padEnd(15)}] ${u.telephone}  /  ${u.mdp}`);
    }

    console.log('\n🎯 Connexion possible avec :');
    console.log('   📱 Téléphone  +  🔑 Mot de passe\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur :', err.message);
    process.exit(1);
  }
})();
