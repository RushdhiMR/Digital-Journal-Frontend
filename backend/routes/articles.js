const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/articles - Get all articles or filter by category / featured
router.get('/', async (req, res) => {
  try {
    const { category, featured, search } = req.query;

    try {
      let query = `
        SELECT a.id, a.title, a.slug, a.description, a.content, a.author, a.image_url, 
               a.is_editors_pick, a.is_featured, a.published_at, c.name as category_name, c.slug as category_slug
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
      `;
      const params = [];
      const conditions = [];

      if (category) {
        conditions.push('c.slug = ?');
        params.push(category);
      }
      if (featured === 'true') {
        conditions.push('a.is_featured = 1');
      }
      if (search) {
        conditions.push('(a.title LIKE ? OR a.description LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY a.published_at DESC LIMIT 30';

      const [rows] = await db.query(query, params);

      if (rows && rows.length > 0) {
        return res.json({
          success: true,
          count: rows.length,
          articles: rows,
        });
      }
    } catch (dbError) {
      console.warn('[Backend Articles] DB query error, returning fallback articles:', dbError);
    }

    // Fallback data if DB tables are being initialized
    const fallbackArticles = [
      {
        id: 1,
        title: "Review: Has AI been chasing the wrong dream since Alan Turing?",
        slug: "review-has-ai-been-chasing-the-wrong-dream",
        description: "The essential question, then, is not whether machines can imitate people.",
        author: "Dr. Tim Sandle",
        image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop",
        category_name: "Technology",
        category_slug: "technology"
      },
      {
        id: 2,
        title: "Silicon chips learn to write DNA: Research points to cleaner route for synthetic biology",
        slug: "silicon-chips-learn-to-write-dna",
        description: "The Harvard chip is an early-stage demonstration rather than an industrial replacement.",
        author: "Dr. Tim Sandle",
        image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop",
        category_name: "Technology",
        category_slug: "technology"
      }
    ];

    return res.json({
      success: true,
      count: fallbackArticles.length,
      articles: fallbackArticles,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// GET /api/articles/:slug - Get single article details
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    try {
      const [rows] = await db.query(
        `SELECT a.*, c.name as category_name, c.slug as category_slug 
         FROM articles a 
         LEFT JOIN categories c ON a.category_id = c.id 
         WHERE a.slug = ?`,
        [slug]
      );

      if (rows && rows.length > 0) {
        return res.json({
          success: true,
          article: rows[0],
        });
      }
    } catch (dbError) {
      console.warn('[Backend Articles] DB slug query error:', dbError);
    }

    return res.status(404).json({ error: 'Article not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

module.exports = router;
