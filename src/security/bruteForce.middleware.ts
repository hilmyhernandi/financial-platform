import rateLimit, { Options } from "express-rate-limit";
import { RedisStore, RedisReply } from "rate-limit-redis";
import { redisConnection } from "../connections/redis.connection.js";
import { bruteForceConfig } from "../config/bruteForce.config.js";
import { IRedisMessage } from "../interfaces/redis/redis-message.interface.js";

class BruteForceProtector {
  private readonly windowMs: number;
  private readonly maxAttempts: number;
  private readonly message: IRedisMessage;

  constructor() {
    this.windowMs = bruteForceConfig.windowMs;
    this.maxAttempts = bruteForceConfig.maxAttempts;
    this.message = bruteForceConfig.message;
  }

  public getMiddleware() {
    return rateLimit({
      store: new RedisStore({
        sendCommand: async (
          command: string,
          ...args: string[]
        ): Promise<RedisReply> => {
          return redisConnection.call(command, ...args) as Promise<RedisReply>;
        },
      }),
      windowMs: this.windowMs,
      max: this.maxAttempts,
      standardHeaders: true,
      legacyHeaders: false,
      message: this.message,
      handler: (_req, res, _next, options: Options) => {
        const msg = options.message as IRedisMessage;
        res.status(msg.statusCode).json(msg);
      },
    });
  }

  public async checkAttempts(email: string): Promise<number> {
    const key = this.getRateLimitKey(email);
    const attempts = await redisConnection.get(key);
    return attempts ? parseInt(attempts, 10) : 0;
  }

  public async trackFailedLogin(email: string): Promise<void> {
    const key = this.getRateLimitKey(email);
    await redisConnection.incr(key);
    await redisConnection.expire(key, this.windowMs / 1000);
  }

  public async resetFailedAttempts(email: string): Promise<void> {
    const key = this.getRateLimitKey(email);
    const attempts = await redisConnection.get(key);
    if (attempts && parseInt(attempts, 10) < this.maxAttempts) {
      await redisConnection.del(key);
    }
  }

  private getRateLimitKey(email: string): string {
    return `loginAttempts:${email}`;
  }
}

export const bruteForceProtector = new BruteForceProtector();
