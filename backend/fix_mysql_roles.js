const mysql = require('mysql2/promise');

async function fixMySQL() {
  const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'digital_journal_db',
  });

  console.log("1. Altering users.role column to VARCHAR(50)...");
  await pool.query("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'reader'");

  console.log("2. Updating muba@gmail.com role to 'writer'...");
  await pool.query("UPDATE users SET role = 'writer', name = 'Muba' WHERE email = 'muba@gmail.com'");

  console.log("3. Normalizing existing roles in MySQL users table...");
  await pool.query("UPDATE users SET role = 'reader' WHERE role = 'user' OR role = '' OR role IS NULL");
  await pool.query("UPDATE users SET role = 'writer' WHERE role = 'editor'");

  const [allUsers] = await pool.query("SELECT id, name, email, role FROM users");
  console.log("Updated MySQL users roster:", allUsers);

  await pool.end();
  console.log("✅ MySQL database successfully upgraded and fixed!");
}

fixMySQL().catch(console.error);
