const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Trust proxy (Railway, Render, etc.)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: env.NODE_ENV === 'production'
    ? env.APP_URL
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Global rate limiter
app.use(globalLimiter);

// Routes
app.use('/', routes);

// 404
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
const PORT = env.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] Running on port ${PORT} (${env.NODE_ENV})`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
