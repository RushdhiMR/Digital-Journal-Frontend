const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const newsletterRoutes = require('./routes/newsletter');
const articleRoutes = require('./routes/articles');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Mount Express API Routes
app.use('/api/auth', authRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Digital Journal Express.js Backend Server is running smoothly!',
    timestamp: new Date(),
    port: PORT,
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Digital Journal Express.js Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Auth API:     http://localhost:${PORT}/api/auth/login`);
  console.log(`   Articles API: http://localhost:${PORT}/api/articles`);
  console.log(`====================================================`);
});
