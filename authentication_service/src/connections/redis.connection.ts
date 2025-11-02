import { Redis } from "ioredis";
import { redisConfig } from "../config/redis.config.js";
import { loggerRedis } from "../config/logger.config.js";


const createRedisConnection = () => {
  try {

    const redisOptions = {
      port: redisConfig.port,
      host: redisConfig.host,
      username: redisConfig.username,
      password: redisConfig.password,
      lazyConnect: true,
      enableReadyCheck: true,
      showFriendlyErrorStack: true,
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 100, 2000);
        if (times > 10) {
          loggerRedis.error("Batas maksimum retry Redis tercapai");
          return null;
        }
        return delay;
      },
    };

    const redis = new Redis(redisOptions);

    redis.on("connect", () => {
      loggerRedis.info("Redis connected successfully");
    });

    redis.on("close", () => {
      loggerRedis.error("Redis connection closed unexpectedly");
    });

    redis.on("end", () => {
      loggerRedis.error("Redis connection ended");
    });

    redis.on("reconnecting", (delay: number) => {
      loggerRedis.warn(`Reconnecting to Redis in ${delay}ms`);
    });

    redis.on("error", (err: Error) => {
      loggerRedis.error("Redis connection error", {
        message: err.message,
        stack: err.stack,
      });
    });

    return redis;
  } catch (error) {
    loggerRedis.error("Failed to create Redis instance", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

export const redisConnection = createRedisConnection();
