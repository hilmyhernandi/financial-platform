/**
 * Redis Service
 * 
 * Provides a high-level interface for Redis operations with JSON serialization,
 * TTL management, and typed data retrieval.
 * 
 * Features:
 * - Automatic JSON serialization/deserialization
 * - TTL (Time To Live) support
 * - Typed data retrieval
 * - Atomic updates
 * - Key deletion
 * 
 * @example
 * ```typescript
 * const redis = new RedisService();
 * await redis.setValue('user:123', { name: 'John' }, 3600); // expires in 1 hour
 * const user = await redis.getValue<User>('user:123');
 * ```
 */

import { redisConnection } from "../connections/redis.connection.js";

export class RedisService {
  /**
   * Stores a value in Redis with optional expiration
   * 
   * @param key - Redis key to store the value under
   * @param value - Value to store (will be JSON stringified)
   * @param ttl - Optional Time To Live in seconds
   */
  async setValue(key: string, value: unknown, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);

    if (typeof ttl === "number" && ttl > 0) {
      await redisConnection.set(key, stringValue, "EX", ttl);
    } else {
      await redisConnection.set(key, stringValue);
    }
  }

  /**
   * Retrieves and parses a stored value from Redis
   * 
   * @param key - Redis key to retrieve
   * @returns Parsed value or null if not found
   * @template T - Type of the stored value
   */
  async getValue<T = unknown>(key: string): Promise<T | null> {
    const data = await redisConnection.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  /**
   * Gets the remaining Time To Live for a key
   * 
   * @param key - Redis key to check
   * @returns Remaining TTL in seconds, -2 if key doesn't exist, -1 if no TTL
   */
  async getTTL(key: string): Promise<number> {
    return await redisConnection.ttl(key);
  }

  /**
   * Updates specific fields of a stored object while preserving others
   * Maintains the original TTL of the key
   * 
   * @param key - Redis key of the object to update
   * @param updates - Object containing fields to update
   * @returns void if successful, null if key doesn't exist
   */
  async updateValues(
    key: string,
    updates: Record<string, unknown>
  ): Promise<void | null> {
    const existingData = await this.getValue<Record<string, unknown>>(key);
    if (!existingData) return null;

    const ttl = await this.getTTL(key);
    const mergedData = { ...existingData, ...updates };
    const stringified = JSON.stringify(mergedData);

    if (ttl > 0) {
      await redisConnection.set(key, stringified, "EX", ttl);
    } else {
      await redisConnection.set(key, stringified);
    }
  }

  /**
   * Deletes a key from Redis
   * 
   * @param key - Redis key to delete
   * @returns 1 if key was deleted, 0 if key didn't exist
   */
  async deleteKey(key: string): Promise<number> {
    return await redisConnection.del(key);
  }
}
