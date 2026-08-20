const mysql = require('mysql2/promise');

async function alterImageColumns() {
  const db = mysql.createPool({
    host: 'localhost', port: 3306, user: 'root', password: '',
    database: 'digital_journal_db'
  });

  console.log('Altering image_url and related columns to LONGTEXT...');
  await db.query('ALTER TABLE articles MODIFY COLUMN image_url LONGTEXT NULL');
  await db.query('ALTER TABLE articles MODIFY COLUMN image_caption TEXT NULL');
  await db.query('ALTER TABLE articles MODIFY COLUMN author_avatar LONGTEXT NULL');
  await db.query('ALTER TABLE articles MODIFY COLUMN content LONGTEXT NULL');
  await db.query('ALTER TABLE articles MODIFY COLUMN summary LONGTEXT NULL');
  await db.query('ALTER TABLE articles MODIFY COLUMN description LONGTEXT NULL');

  const [cols] = await db.query('DESCRIBE articles');
  console.log('Updated columns:');
  cols.forEach(c => console.log(`  ${c.Field}: ${c.Type}`));

  process.exit(0);
}

alterImageColumns().catch(e => { console.error(e); process.exit(1); });
