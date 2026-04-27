const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// ─────────────────────────────────────────────────────
// POST /api/auth/login
// Body attendu : { telephone, mot_de_passe }
// ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { telephone, mot_de_passe } = req.body;

  // 1. Validation basique
  if (!telephone || !mot_de_passe) {
    return res.status(400).json({
      success: false,
      message: 'Numéro de téléphone et mot de passe requis',
    });
  }

  try {
    // 2. Nettoyage du numéro (espaces et tirets tolérés côté client)
    const tel = telephone.replace(/[\s\-]/g, '');

    // 3. Recherche par téléphone uniquement
    const [users] = await pool.execute(
      'SELECT * FROM utilisateur WHERE telephone = ? AND statut = 1',
      [tel]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Numéro de téléphone ou mot de passe incorrect',
      });
    }

    const user = users[0];

    // 4. Vérification du mot de passe (bcrypt)
    const isValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Numéro de téléphone ou mot de passe incorrect',
      });
    }

    // 5. Création du token JWT
    const token = jwt.sign(
      {
        id: user.id_util,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom,
      },
      process.env.JWT_SECRET || 'elitegym_secret_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // 6. Mise à jour last_login
    await pool.execute(
      'UPDATE utilisateur SET last_login = NOW() WHERE id_util = ?',
      [user.id_util]
    );

    // 7. Redirection selon le rôle (doit correspondre aux valeurs en BDD)
    const redirectMap = {
      administrateur: '/admin',
      gerant:         '/gerant',
      receptionniste: '/reception',
      coach:          '/coach',
      membre:         '/membre',
    };
    const role = user.role?.toLowerCase();

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id:        user.id_util,
        nom:       user.nom,
        prenom:    user.prenom,
        telephone: user.telephone,
        role:      user.role,        // valeur brute de la BDD
      },
      redirect: redirectMap[role] || '/',
    });

  } catch (error) {
    console.error('❌ Erreur login:', error.message);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
});

// ─────────────────────────────────────────────────────
// GET /api/auth/me  — vérifier sa session
// ─────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(
      authHeader.split(' ')[1],
      process.env.JWT_SECRET || 'elitegym_secret_2026'
    );

    const [users] = await pool.execute(
      'SELECT id_util, nom, prenom, telephone, role FROM utilisateur WHERE id_util = ? AND statut = 1',
      [decoded.id]
    );

    if (!users.length) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    }

    res.json({ success: true, user: users[0] });

  } catch {
    res.status(403).json({ success: false, message: 'Token invalide ou expiré' });
  }
});

// ─────────────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Déconnexion réussie' });
});

module.exports = router;
