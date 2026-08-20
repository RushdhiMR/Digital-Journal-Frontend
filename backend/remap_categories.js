const mysql = require('mysql2/promise');

async function fix() {
  const db = mysql.createPool({ 
    host: 'localhost', port: 3306, user: 'root', password: '', 
    database: 'digital_journal_db' 
  });

  // Remap 'Industry Insights' (id=3) articles → Business (id=2)
  const [r1] = await db.query('UPDATE articles SET category_id = 2 WHERE category_id = 3');
  console.log('Reassigned Industry Insights -> Business, affected rows:', r1.affectedRows);

  // Remap 'Innovation' (id=5) articles → Technology (id=4)  
  const [r2] = await db.query('UPDATE articles SET category_id = 4 WHERE category_id = 5');
  console.log('Reassigned Innovation -> Technology, affected rows:', r2.affectedRows);

  // Verify
  const [arts] = await db.query(
    'SELECT a.id, a.title, a.status, c.name as cat_name FROM articles a LEFT JOIN categories c ON a.category_id = c.id ORDER BY a.id'
  );
  console.log('Updated articles:');
  arts.forEach(a => console.log(`  [${a.id}] ${a.cat_name} | ${a.status} | ${a.title.substring(0, 60)}`));

  process.exit(0);
}

fix().catch(e => { console.error(e); process.exit(1); });
