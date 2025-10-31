import { CookieOptions } from "express";
import { env } from "./env.config.js";

const isProduction = env.mode === "production";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 1000 * 60 * 60 * 24,
};
