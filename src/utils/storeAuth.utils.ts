import { Request, Response } from "express";
import { RedisService } from "../service/redis.service.js";
import { CookieManager } from "./cookies.utils.js";
import {
  IStoreService,
  RedisEntry,
  CookieEntry,
  SessionEntry,
} from "../interfaces/utils/store.interface.js";

class StoreAuthUtils implements IStoreService {
  private readonly redis: RedisService;
  private readonly cookies: CookieManager;

  constructor(redisService?: RedisService, cookieManager?: CookieManager) {
    this.redis = redisService ?? new RedisService();
    this.cookies = cookieManager ?? new CookieManager();
  }

  public async storeTokenRedis(
    entry: RedisEntry | RedisEntry[]
  ): Promise<void> {
    const entries = Array.isArray(entry) ? entry : [entry];

    for (const { name, value, expiry } of entries) {
      await this.redis.setValue(name, value, expiry);
    }
  }

  public storeCookie(res: Response, entry: CookieEntry | CookieEntry[]): void {
    const entries = Array.isArray(entry) ? entry : [entry];

    for (const { name, value } of entries) {
      this.cookies.set(res, name, value);
    }
  }

  public storeSession(
    req: Request,
    entry: SessionEntry | SessionEntry[]
  ): void {
    const entries = Array.isArray(entry) ? entry : [entry];

    for (const { userId, username, email } of entries) {
      req.session.usersId = userId;
      req.session.username = username;
      req.session.email = email;
    }
  }

  public async clearAuthData(
    req: Request,
    res: Response,
    email: string
  ): Promise<void> {
    await Promise.all([this.redis.deleteKey(`refreshToken:${email}`)]);

    this.cookies.clear(res, "accessToken");
    this.cookies.clear(res, "refreshToken");
    this.cookies.clear(res, "x-csrf-token");
    this.cookies.clear(res, "connect.sid");

    // hapus session
    if (req.session) req.session.destroy(() => {});
  }
}

export const storeAuthUtils = new StoreAuthUtils();
