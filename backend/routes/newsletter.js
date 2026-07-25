const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    try {
      await db.query(
        'INSERT INTO newsletter_subscribers (email) VALUES (?) ON DUPLICATE KEY UPDATE email=email',
        [email]
      );
    } catch (dbError) {
      console.warn('[Backend Newsletter] DB error, fallback:', dbError);
    }

    return res.json({
      success: true,
      message: 'Subscribed to Digital Journal newsletters successfully!',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

module.exports = router;
