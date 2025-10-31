import { Response, Request } from "express";
import { cookieOptions } from "../config/cookie.config.js";

export class CookieManager {
  constructor(private options = cookieOptions) {}

  set(res: Response, name: string, value: string): void {
    res.cookie(name, value, this.options);
  }

  get(req: Request, name: string): string | undefined {
    return req.cookies?.[name];
  }

  clear(res: Response, name: string): void {
    res.clearCookie(name, this.options);
  }
}
