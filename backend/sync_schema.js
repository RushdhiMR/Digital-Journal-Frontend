const mysql = require('mysql2/promise');

async function sync() {
  const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'digital_journal_db'
  });

  console.log('Connecting to digital_journal_db...');
  const [cols] = await db.query('DESCRIBE articles');
  const existing = cols.map(c => c.Field);
  console.log('Existing columns:', existing);

  const needed = [
    ['content', 'LONGTEXT NULL'],
    ['summary', 'TEXT NULL'],
    ['status', "VARCHAR(50) NOT NULL DEFAULT 'Published'"],
    ['placement', "VARCHAR(100) DEFAULT 'Standard Post'"],
    ['subcategories', 'TEXT NULL'],
    ['tags', 'TEXT NULL'],
    ['read_duration', "VARCHAR(50) DEFAULT '4 MIN READ'"],
    ['reads_count', 'INT DEFAULT 0'],
    ['author_name', 'VARCHAR(150) NULL'],
    ['author_email', 'VARCHAR(150) NULL'],
    ['author_avatar', 'VARCHAR(500) NULL'],
    ['author_bio', 'TEXT NULL'],
    ['seo', 'TEXT NULL']
  ];

  for (const [col, def] of needed) {
    if (!existing.includes(col)) {
      await db.query(`ALTER TABLE articles ADD COLUMN ${col} ${def}`);
      console.log(`Added column: ${col}`);
    }
  }

  const [newCols] = await db.query('DESCRIBE articles');
  console.log('Final columns in articles:', newCols.map(c => c.Field));
  process.exit(0);
}

sync().catch(err => {
  console.error('Error syncing schema:', err);
  process.exit(1);
});
