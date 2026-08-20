const mysql = require('mysql2/promise');

async function cleanCategories() {
  const db = mysql.createPool({ 
    host: 'localhost', port: 3306, user: 'root', password: '', 
    database: 'digital_journal_db' 
  });

  // The navigation-based categories we want to keep
  const validSlugs = ['news', 'business', 'technology', 'innovation', 'events'];

  // Move subcategories from Industry Insights (id=3) to Business (id=2)
  await db.query('UPDATE subcategories SET category_id = 2 WHERE category_id = 3');
  console.log('Moved subcategories from Industry Insights -> Business');

  // Delete the Industry Insights category (no longer used)
  await db.query("DELETE FROM categories WHERE slug = 'industry-insights'");
  console.log('Deleted Industry Insights category');

  // Show remaining categories
  const [cats] = await db.query('SELECT id, name, slug FROM categories ORDER BY id');
  console.log('Remaining categories:');
  cats.forEach(c => console.log(`  [${c.id}] ${c.name} (${c.slug})`));

  // Show subcategories
  const [subs] = await db.query(
    'SELECT s.id, s.name, s.slug, c.name as parent FROM subcategories s LEFT JOIN categories c ON s.category_id = c.id ORDER BY s.category_id, s.id'
  );
  console.log('Subcategories:');
  subs.forEach(s => console.log(`  [${s.id}] ${s.parent} > ${s.name} (${s.slug})`));

  process.exit(0);
}

cleanCategories().catch(e => { console.error(e); process.exit(1); });
