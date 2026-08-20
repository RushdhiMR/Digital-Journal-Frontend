const mysql = require('mysql2/promise');

async function inspect() {
  const db = mysql.createPool({
    host: 'localhost', port: 3306, user: 'root', password: '',
    database: 'digital_journal_db'
  });

  const [arts] = await db.query('SELECT id, title, author_name, author_email, image_url, category_id, subcategories FROM articles ORDER BY id DESC');
  console.log('Articles in DB:', JSON.stringify(arts, null, 2));

  process.exit(0);
}

inspect().catch(e => { console.error(e); process.exit(1); });
