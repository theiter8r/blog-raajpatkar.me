const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ...(env.NODE_ENV === 'production' && {
    ssl: { rejectUnauthorized: false },
  }),
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

const db = {
  query: (text, params) => pool.query(text, params),

  getClient: async () => {
    const client = await pool.connect();
    const originalRelease = client.release.bind(client);
    client.release = () => {
      client.release = originalRelease;
      return originalRelease();
    };
    return client;
  },

  transaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  pool,
};

module.exports = db;
