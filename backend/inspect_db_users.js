const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function inspect() {
  console.log("--- 1. JSON DB USERS ---");
  const jsonPath = path.join(__dirname, '../frontend/data/digital_journal_db.json');
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(data.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
  }

  console.log("\n--- 2. MYSQL USERS ---");
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'digital_journal_db',
    });
    const [rows] = await pool.query('SELECT id, name, email, role FROM users');
    console.log(rows);
    await pool.end();
  } catch (err) {
    console.log("MySQL not connected or error:", err.message);
  }
}

inspect();
