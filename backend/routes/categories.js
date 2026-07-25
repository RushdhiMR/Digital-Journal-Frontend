const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    try {
      const [rows] = await db.query('SELECT id, name, slug FROM categories ORDER BY id ASC');
      if (rows && rows.length > 0) {
        return res.json({
          success: true,
          categories: rows,
        });
      }
    } catch (dbError) {
      console.warn('[Backend Categories] DB query error, fallback:', dbError);
    }

    const fallbackCategories = [
      { id: 1, name: 'Business', slug: 'business' },
      { id: 2, name: 'Technology', slug: 'technology' },
      { id: 3, name: 'Industry Insights', slug: 'industry-insights' },
      { id: 4, name: 'Innovation', slug: 'innovation' },
      { id: 5, name: 'News', slug: 'news' },
      { id: 6, name: 'Events', slug: 'events' },
    ];

    return res.json({
      success: true,
      categories: fallbackCategories,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

module.exports = router;
