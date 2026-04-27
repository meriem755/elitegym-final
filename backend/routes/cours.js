const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
// const { authenticateToken } = require('../middleware/auth'); // ← Plus besoin ici

// ✅ GET /api/cours?jour=Monday — PUBLIC (pas d'authentification requise)
router.get('/', async (req, res) => {
  try {
    const jour = req.query.jour; // 'Monday', 'Tuesday', etc.
    
    let query = `
      SELECT 
        c.id_cours,
        c.type_cours,
        c.date_cours,
        c.heure_debut,
        c.duree_minutes,
        c.salle,
        c.capacite_max,
        c.places_restantes,
        c.statut,
        u.prenom AS coach_prenom,
        u.nom AS coach_nom
      FROM cours c
      JOIN coach co ON c.id_coach = co.id_coach
      JOIN utilisateur u ON co.id_util = u.id_util
      WHERE c.statut = 'publie'
    `;
    
    const params = [];
    
    if (jour) {
      query += ' AND DAYNAME(c.date_cours) = ?';
      params.push(jour);
    }
    
    query += ' ORDER BY c.heure_debut';
    
    const [rows] = await pool.execute(query, params);
    
    res.json({ success: true, data: rows });
    
  } catch (error) {
    console.error('❌ Erreur GET /cours:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ✅ POST /api/cours/:id/reserver — PROTÉGÉ (nécessite authentification)
// Cette route sera créée plus tard pour la réservation
// router.post('/:id/reserver', authenticateToken, async (req, res) => { ... });

module.exports = router;