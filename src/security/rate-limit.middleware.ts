import rateLimit, {
  RateLimitRequestHandler,
  Options,
} from "express-rate-limit";
import { RedisStore, RedisReply } from "rate-limit-redis";
import { redisConnection } from "../connections/redis.connection.js";
import { loggerRedis } from "../config/logger.config.js";
import { rateLimitConfig } from "../config/rate-limit.config.js";
import { Request, Response, NextFunction } from "express";

export class RateLimiter {
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(
    windowMs = rateLimitConfig.windowMs,
    maxRequests = rateLimitConfig.maxRequests
  ) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  public getMiddleware(): RateLimitRequestHandler {
    return rateLimit({
      store: new RedisStore({
        sendCommand: async (
          command: string,
          ...args: string[]
        ): Promise<RedisReply> => {
          try {
            const result = await redisConnection.call(command, ...args);
            return result as RedisReply;
          } catch (error) {
            loggerRedis.error("Redis sendCommand error in rateLimiter", {
              message: (error as Error).message,
              stack: (error as Error).stack,
              command,
              args,
            });
            throw error;
          }
        },
      }),
      windowMs: this.windowMs,
      max: this.maxRequests,
      standardHeaders: rateLimitConfig.standardHeaders,
      legacyHeaders: rateLimitConfig.legacyHeaders,
      message: rateLimitConfig.message,
      handler: (
        req: Request,
        res: Response,
        _next: NextFunction,
        optionsUsed: Options
      ) => {
        const customMessage =
          optionsUsed.message as typeof rateLimitConfig.message;
        loggerRedis.warn(`rate limit exceeded for IP: ${req.ip}`);
        res.status(customMessage.statusCode).json(customMessage);
      },
    });
  }
}
