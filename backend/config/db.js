const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'elitegym',
  waitForConnections: true,
  connectionLimit: 10,
});

const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connecté à "' + process.env.DB_NAME + '"');
    conn.release();
    return true;
  } catch (err) {
    console.error('❌ Connexion MySQL échouée:', err.message);
    return false;
  }
};

module.exports = { pool, testConnection };
