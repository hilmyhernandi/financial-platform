import type { Request, Response, NextFunction } from "express";
import {
  doubleCsrfProtection,
  invalidCsrfTokenError,
} from "../config/csrf.config.js";

export function sendCsrfToken(req: Request, res: Response) {
  const token = req.csrfToken?.() ?? "";
  res.json({ csrfToken: token });
}

export function csrfErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (err === invalidCsrfTokenError) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  console.error(err);
  next(err);
}

export { doubleCsrfProtection };