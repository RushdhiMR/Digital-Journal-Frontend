const mysql = require('mysql2/promise');

async function schema() {
  const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'digital_journal_db',
  });
  const [cols] = await pool.query('DESCRIBE users');
  console.log("USERS COLUMNS:", cols);

  const [muba] = await pool.query('SELECT * FROM users WHERE email = "muba@gmail.com"');
  console.log("MUBA ROW:", muba);

  await pool.end();
}

schema().catch(console.error);
