const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function initDB() {
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'digital_journal_db';

  console.log(`Connecting to MySQL server at ${host}:${port} as ${user}...`);

  try {
    const conn = await mysql.createConnection({ host, port, user, password });
    console.log('SUCCESS: Connected to MySQL server!');

    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`Database \`${dbName}\` created/verified.`);
    await conn.changeUser({ database: dbName });

    // Create users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL UNIQUE,
        \`password_hash\` VARCHAR(255) NULL,
        \`provider\` VARCHAR(50) NOT NULL DEFAULT 'local',
        \`google_id\` VARCHAR(255) NULL,
        \`role\` ENUM('reader', 'writer', 'admin') NOT NULL DEFAULT 'reader',
        \`email_verified\` BOOLEAN DEFAULT FALSE,
        \`reset_token\` VARCHAR(255) NULL,
        \`reset_token_expires\` DATETIME NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('`users` table created/verified.');

    // Seed default users
    const adminPassHash = await bcrypt.hash('admin123', 10);
    const writerPassHash = await bcrypt.hash('writer123', 10);
    const readerPassHash = await bcrypt.hash('reader123', 10);

    const seedUsers = [
      ['System Administrator', 'admin@digitaljournal.com', adminPassHash, 'admin', 'local'],
      ['Jennifer Friesen', 'writer@digitaljournal.com', writerPassHash, 'writer', 'local'],
      ['Alex Reader', 'reader@digitaljournal.com', readerPassHash, 'reader', 'local']
    ];

    for (const [name, email, passHash, role, provider] of seedUsers) {
      await conn.query(
        `INSERT INTO users (name, email, password_hash, role, provider, email_verified) 
         VALUES (?, ?, ?, ?, ?, TRUE) 
         ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash), role=VALUES(role);`,
        [name, email.toLowerCase().trim(), passHash, role, provider]
      );
    }
    console.log('Seed users initialized into MySQL!');

    const [rows] = await conn.query('SELECT id, name, email, role, provider FROM users');
    console.log('Current DB Users:', rows);

    await conn.end();
    return true;
  } catch (err) {
    console.warn('MySQL init error:', err.code || err.message, err);
    return false;
  }
}

if (require.main === module) {
  initDB();
}

module.exports = { initDB };
