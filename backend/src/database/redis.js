const redis = require('redis');

let redisClient = null;

async function connectRedis() {
  try {
    redisClient = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
}

function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
}

// Cache helper functions
async function setCache(key, value, expiry = 3600) {
  try {
    const client = getRedisClient();
    await client.setEx(key, expiry, JSON.stringify(value));
  } catch (error) {
    console.error('Redis setCache error:', error);
  }
}

async function getCache(key) {
  try {
    const client = getRedisClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis getCache error:', error);
    return null;
  }
}

async function deleteCache(key) {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error('Redis deleteCache error:', error);
  }
}

module.exports = {
  connectRedis,
  getRedisClient,
  setCache,
  getCache,
  deleteCache
};

