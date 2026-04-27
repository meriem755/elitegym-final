const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/reservations — Voir ses réservations
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'membre') {
      // Trouver id_membre pour cet utilisateur
      const [membres] = await pool.query(
        'SELECT id_membre FROM membre WHERE id_util = ?',
        [req.user.id]
      );
      if (membres.length === 0) {
        return res.status(404).json({ success: false, message: 'Profil membre non trouvé' });
      }
      
      const [rows] = await pool.query(
        `SELECT r.id_reservation, r.statut, r.date_reservation,
                c.type_cours, c.date_cours, c.heure_debut, c.salle,
                u.prenom AS coach_prenom, u.nom AS coach_nom
         FROM reservation r
         JOIN cours c ON r.id_cours = c.id_cours
         JOIN coach co ON c.id_coach = co.id_coach
         JOIN utilisateur u ON co.id_util = u.id_util
         WHERE r.id_membre = ?
         ORDER BY c.date_cours DESC, c.heure_debut DESC`,
        [membres[0].id_membre]
      );
      return res.json({ success: true, data: rows });
    }

    // Admin/Gérant/Coach : voir toutes les réservations
    const [rows] = await pool.query(
      `SELECT r.id_reservation, r.statut, r.date_reservation,
              m.num_adherent, u_m.prenom AS membre_prenom, u_m.nom AS membre_nom,
              c.type_cours, c.date_cours, c.heure_debut
       FROM reservation r
       JOIN membre m ON r.id_membre = m.id_membre
       JOIN utilisateur u_m ON m.id_util = u_m.id_util
       JOIN cours c ON r.id_cours = c.id_cours
       ORDER BY r.date_reservation DESC LIMIT 50`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ Erreur GET /reservations:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/reservations — Réserver un cours (membre uniquement)
router.post('/', authenticateToken, async (req, res) => {
  const { id_cours } = req.body;
  if (!id_cours) return res.status(400).json({ success: false, message: 'id_cours requis' });

  try {
    if (req.user.role !== 'membre') {
      return res.status(403).json({ success: false, message: 'Seuls les membres peuvent réserver' });
    }

    const [membres] = await pool.query('SELECT id_membre FROM membre WHERE id_util = ?', [req.user.id]);
    if (membres.length === 0) return res.status(404).json({ success: false, message: 'Profil membre introuvable' });
    const idMembre = membres[0].id_membre;

    // Vérifier disponibilité du cours
    const [cours] = await pool.query('SELECT places_restantes, statut FROM cours WHERE id_cours = ?', [id_cours]);
    if (cours.length === 0) return res.status(404).json({ success: false, message: 'Cours introuvable' });
    if (cours[0].statut !== 'publie' || cours[0].places_restantes <= 0) {
      return res.status(400).json({ success: false, message: 'Cours complet ou non disponible' });
    }

    // Vérifier double réservation
    const [existing] = await pool.query(
      'SELECT id_reservation FROM reservation WHERE id_membre = ? AND id_cours = ?',
      [idMembre, id_cours]
    );
    if (existing.length > 0) return res.status(400).json({ success: false, message: 'Déjà réservé' });

    // Créer la réservation + décrémenter les places
    await pool.query(
      'INSERT INTO reservation (id_membre, id_cours, date_reservation, statut) VALUES (?, ?, NOW(), "confirmée")',
      [idMembre, id_cours]
    );
    await pool.query('UPDATE cours SET places_restantes = places_restantes - 1 WHERE id_cours = ?', [id_cours]);

    res.json({ success: true, message: 'Réservation confirmée !' });
  } catch (err) {
    console.error('❌ Erreur POST /reservations:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;