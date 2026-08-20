const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function sync() {
  const jsonPath = path.join(__dirname, '../frontend/data/digital_journal_db.json');
  const dbData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'digital_journal_db',
  });

  console.log("Syncing database users into MySQL...");
  for (const user of dbData.users) {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [user.email.toLowerCase()]);
    if (existing.length > 0) {
      await pool.query(
        'UPDATE users SET name = ?, role = ?, password_hash = ? WHERE email = ?',
        [user.name, user.role, user.password_hash, user.email.toLowerCase()]
      );
      console.log(`Updated user ${user.email} -> ${user.role}`);
    } else {
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role, provider, email_verified) VALUES (?, ?, ?, ?, ?, ?)',
        [user.name, user.email.toLowerCase(), user.password_hash, user.role, user.provider || 'local', 1]
      );
      console.log(`Inserted user ${user.email} -> ${user.role}`);
    }
  }

  const [all] = await pool.query('SELECT id, name, email, role FROM users');
  console.log("Final MySQL Users table:", all);
  await pool.end();
}

sync().catch(console.error);
