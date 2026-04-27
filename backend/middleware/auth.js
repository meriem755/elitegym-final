const jwt = require('jsonwebtoken');

// Vérifier si l'utilisateur est authentifié
const authenticateToken = (req, res, next) => {
  // Récupérer le token depuis Header ou Cookie
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1] || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Accès non autorisé — Token manquant' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, nom, prenom }
    next();
  } catch (error) {
    console.error('❌ Erreur verification token:', error.message);
    return res.status(403).json({ 
      success: false, 
      message: 'Token invalide ou expiré' 
    });
  }
};

// Vérifier les rôles autorisés
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    const userRole = req.user.role?.toLowerCase();
    
    if (!allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Accès refusé — Permissions insuffisantes' 
      });
    }
    
    next();
  };
};

module.exports = { authenticateToken, checkRole };