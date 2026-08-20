const mysql = require('mysql2/promise');

async function fixArticle6and7() {
  const db = mysql.createPool({
    host: 'localhost', port: 3306, user: 'root', password: '',
    database: 'digital_journal_db'
  });

  // Fix Article 6 (Luigi Mangione): author should be Rushdhi MR (the writer), and set a high quality crisp news image
  await db.query(`
    UPDATE articles SET
      author_name = 'Rushdhi MR',
      author_email = 'rushdhiriyaj2005@gmail.com',
      image_url = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=750&fit=crop'
    WHERE id = 6
  `);

  // Fix Article 7 (Structural Acrylic Pioneers): author should be Rushdhi MR, and set high quality crisp image
  await db.query(`
    UPDATE articles SET
      author_name = 'Rushdhi MR',
      author_email = 'rushdhiriyaj2005@gmail.com',
      image_url = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=750&fit=crop'
    WHERE id = 7
  `);

  const [rows] = await db.query('SELECT id, title, author_name, image_url, category_id, subcategories FROM articles ORDER BY id DESC');
  console.log('Fixed articles:', JSON.stringify(rows, null, 2));

  process.exit(0);
}

fixArticle6and7().catch(e => { console.error(e); process.exit(1); });
