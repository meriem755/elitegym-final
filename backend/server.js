const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { testConnection } = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const coursRoutes = require('./routes/cours');
const formulesRoutes = require('./routes/formules');
const coachesRoutes = require('./routes/coaches');
const reservationsRoutes = require('./routes/reservations');

const app = express();
const PORT = process.env.PORT || 3000;

// 🛡️ Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5500'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 📝 Logger simple
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${req.ip}`);
  next();
});

// 🏠 Route de test
app.get('/', (req, res) => {
  res.json({ 
    name: 'ÉLITE GYM API', 
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// 🗂️ Routes API
app.use('/api/auth', authRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/formules', formulesRoutes);
app.use('/api/coaches', coachesRoutes);
app.use('/api/reservations', reservationsRoutes);

// ❌ Gestion 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// ❌ Gestion erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur globale:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne du serveur' 
  });
});

// 🚀 Démarrage serveur
const startServer = async () => {
  const dbOk = await testConnection();
  
  if (!dbOk) {
    console.error('⚠️ Le serveur démarre sans connexion DB — certaines routes ne fonctionneront pas');
  }

  app.listen(PORT, () => {
    console.log(`🚀 ÉLITE GYM API démarrée sur http://localhost:${PORT}`);
    console.log(`📁 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 CORS autorisé pour: ${process.env.CORS_ORIGIN || 'localhost:5173, localhost:5500'}`);
  });
};

startServer();