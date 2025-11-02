import { doubleCsrf } from "csrf-csrf";
import { env } from "./env.config.js";
import type { Request } from "express";

const CSRF_SECRET = env.csrfSecret;

export const { doubleCsrfProtection, invalidCsrfTokenError } = doubleCsrf({
  getSecret: () => CSRF_SECRET,
  cookieName: "x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: env.mode === "production",
  },
  getCsrfTokenFromRequest: (req: Request): string => {
    return (req.headers["x-csrf-token"] as string) ?? "";
  },
  getSessionIdentifier: (req: Request): string => {
    return req.ip || "anonymous";
  },
});
