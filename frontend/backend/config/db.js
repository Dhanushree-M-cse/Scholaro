const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Validate required environment variables on startup
const REQUIRED_DB_VARS = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missing = REQUIRED_DB_VARS.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`❌ CONFIGURATION ERROR: Missing required database environment variables: ${missing.join(', ')}`);
  console.error('Please set these environment variables before starting the server.');
  console.error('Refer to backend/.env.example for the required variables.');
  // Do not crash immediately — allow health endpoint to still respond
  // but DB queries will fail gracefully
}

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'scholaro_db',
  waitForConnections: true,
  connectionLimit: process.env.VERCEL ? 5 : 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

// Enable SSL for cloud MySQL providers (Aiven, TiDB Cloud, PlanetScale, Railway, etc.)
// Auto-enabled if DB_SSL=true or if port is 4000 (TiDB Cloud default) or host is remote
if (process.env.DB_SSL === 'true' || process.env.DB_PORT === '4000' || (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1' && process.env.DB_SSL !== 'false')) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool(poolConfig);

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully.');
    console.log(`   Host: ${poolConfig.host}:${poolConfig.port} | DB: ${poolConfig.database}`);
    connection.release();
    return true;
  } catch (error) {
    console.error(`❌ MySQL Connection Failed: ${error.message}`);
    console.error(`   Host: ${poolConfig.host}:${poolConfig.port} | DB: ${poolConfig.database}`);
    console.error('   Make sure DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME environment variables are set correctly.');
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
