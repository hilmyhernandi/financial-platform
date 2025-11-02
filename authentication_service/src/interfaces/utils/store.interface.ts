import { Request, Response } from "express";

export interface RedisEntry {
  name: string;
  value: string;
  expiry: number;
}

export interface CookieEntry {
  name: string;
  value: string;
}

export interface SessionEntry {
  userId: string;
  username: string;
  email: string;
}

export interface IStoreService {
  storeTokenRedis(entry: RedisEntry | RedisEntry[]): Promise<void>;
  storeCookie(res: Response, entry: CookieEntry | CookieEntry[]): void;
  storeSession(req: Request, entry: SessionEntry | SessionEntry[]): void;
}
