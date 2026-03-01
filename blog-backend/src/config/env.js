require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  BLOG_NAME: process.env.BLOG_NAME || 'My Blog',
  FROM_EMAIL: process.env.FROM_EMAIL || 'newsletter@example.com',
};

// Validate required env vars in production
const required = ['DATABASE_URL', 'JWT_SECRET', 'RESEND_API_KEY', 'REDIS_URL'];

if (env.NODE_ENV === 'production') {
  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

module.exports = env;
