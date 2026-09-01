const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

console.log('CORS allowed origin:', CLIENT_URL);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Placement Calendar API is running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Placement Calendar API is healthy',
    database: {
      connected: mongoose.connection.readyState === 1,
      name: mongoose.connection.name || null
    },
    cors: CLIENT_URL
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;