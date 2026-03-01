const IORedis = require('ioredis');
const env = require('./env');

const createRedisConnection = () => {
  const connection = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
    retryStrategy: (times) => {
      if (times > 10) return null;
      return Math.min(times * 200, 5000);
    },
  });

  connection.on('error', (err) => {
    console.error('Redis connection error:', err.message);
  });

  connection.on('connect', () => {
    console.log('Redis connected');
  });

  return connection;
};

module.exports = { createRedisConnection };
