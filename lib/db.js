import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'srv1428.hstgr.io',
  user: process.env.DB_USER || 'u859308447_admin',
  password: process.env.DB_PASSWORD || '111aaa###$A',
  database: process.env.DB_NAME || 'u859308447_ToolsFinder',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
