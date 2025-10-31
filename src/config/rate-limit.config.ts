import { IRedisMessage } from "../interfaces/redis/redis-message.interface.js";

export const rateLimitConfig = {
  windowMs: 60 * 60 * 1000,
  maxRequests: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "too many requests, please try again later",
  } satisfies IRedisMessage,
};
