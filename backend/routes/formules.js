// backend/routes/info.js
const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// GET /api/formules — adapté à ta table formule_abonnement
router.get('/formules', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_formule, nom, duree_jours, tarif, description, actif
       FROM formule_abonnement
       WHERE actif = 1
       ORDER BY tarif`
    );

    const formules = rows.map(f => ({
      id: f.id_formule,
      name: f.nom,
      price: parseFloat(f.tarif),
      period: f.duree_jours == 30 ? '/ mois' : f.duree_jours == 90 ? '/ trimestre' : '/ an',
      features: f.description ? f.description.split('+').map(s => s.trim()) : [],
      featured: f.nom === 'Trimestriel'
    }));

    res.json({ success: true, data: formules });
  } catch (err) {
    console.error('❌ Erreur GET /formules:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/coaches — adapté à tes tables coach + utilisateur
router.get('/coaches', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        c.id_coach,
        u.prenom,
        u.nom,
        c.specialite,
        c.date_embauche
      FROM coach c
      JOIN utilisateur u ON u.id_util = c.id_util
      WHERE u.statut = 1
      ORDER BY u.prenom`
    );

    const coaches = rows.map(c => ({
      id: c.id_coach,
      name: `${c.prenom} ${c.nom}`,
      spec: c.specialite,
      initials: `${c.prenom.charAt(0)}${c.nom.charAt(0)}`,
      bio: `Coach certifié en ${c.specialite?.toLowerCase() || 'fitness'}`,
      gradient: `linear-gradient(135deg, #030c22, #09204a)`
    }));

    res.json({ success: true, data: coaches });
  } catch (err) {
    console.error('❌ Erreur GET /coaches:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;