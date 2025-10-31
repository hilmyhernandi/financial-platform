/**
 * Redis Configuration
 * 
 * Defines Redis connection settings and retry strategies.
 * Supports both development and production environments.
 * 
 * Features:
 * - Environment-based configuration
 * - Exponential backoff retry strategy
 * - Connection failure handling
 * - Secure credentials management
 * 
 * @module redis.config
 */

import { env } from "./env.config.js";

/**
 * Redis client configuration
 * @property {string} host - Redis server hostname
 * @property {number} port - Redis server port
 * @property {string} username - Redis authentication username
 * @property {string} password - Redis authentication password
 * @property {Function} retryStrategy - Connection retry logic
 */
export const redisConfig = {
  host: env.redis.host,
  port: env.redis.port,
  username: env.redis.username,
  password: env.redis.password,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 100, 2000);
    if (times > 10) {
      throw new Error("Redis failed to reconnect after multiple attempts.");
    }
    return delay;
  },
};
