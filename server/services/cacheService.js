import logger from '../utils/logger.js';

// In-memory fallback/mock for now. Easily replaceable with Redis client.
const cacheStore = new Map();

export const cacheService = {
  get: async (key) => {
    logger.debug(`Cache GET: ${key}`);
    const item = cacheStore.get(key);
    if (!item) return null;

    if (item.expiry && item.expiry < Date.now()) {
      cacheStore.delete(key);
      return null;
    }
    return item.value;
  },

  set: async (key, value, ttlSeconds = 3600) => {
    logger.debug(`Cache SET: ${key} (TTL: ${ttlSeconds}s)`);
    cacheStore.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  },

  delete: async (key) => {
    cacheStore.delete(key);
  }
};
