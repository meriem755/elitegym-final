const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET /api/coaches — Liste des coachs
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id_coach, u.prenom, u.nom, c.specialite, c.date_embauche
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