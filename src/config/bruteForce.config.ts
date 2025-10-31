import { IRedisMessage } from "../interfaces/redis/redis-message.interface.js";

export const bruteForceConfig = {
  windowMs: 15 * 60 * 1000,
  maxAttempts: 3,
  message: {
    success: false,
    statusCode: 429,
    message: "too many login attempts, please try again later",
  } satisfies IRedisMessage,
};
