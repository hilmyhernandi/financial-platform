/**
 * Authentication Middleware
 * 
 * Provides middleware functions for JWT-based authentication:
 * - JWT validation
 * - Refresh token verification
 * - Token source tracking (cookie vs header)
 * 
 * Security Features:
 * - Token validation
 * - Redis token storage verification
 * - Safe token verification without try-catch
 * - Multiple token sources support
 * 
 * @module auth.middleware
 */

import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/request/auth-request.interface.js";
import { jwtOptions } from "../utils/jwt.utils.js";
import { RedisService } from "../service/redis.service.js";
import { errorResponse } from "../utils/error/error.js";

const redis = new RedisService();

/**
 * JWT Validation Middleware
 * 
 * Verifies the JWT token from either the Authorization header or cookies.
 * Attaches the decoded user information to the request object.
 * 
 * @param {Request} req - Express request object
 * @param {Response} _res - Express response object
 * @param {NextFunction} next - Express next function
 * @throws {403} - No token provided or invalid token
 */
export const jwtMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.accessToken;
  const token = authHeader ? authHeader.split(" ")[1] : cookieToken;
  const source = authHeader ? "header" : cookieToken ? "cookie" : null;

  if (!token) {
    return next(new errorResponse("Forbidden: No token provided", 403));
  }

  const result = safeVerify(() => jwtOptions.verifyToken(token));
  if (!result.ok) {
    return next(
      new errorResponse("Forbidden: Invalid or expired access token", 403)
    );
  }

  const authReq = req as AuthRequest;
  authReq.user = result.value;
  authReq.authSource = source;
  next();
};

/**
 * Refresh Token Verification Middleware
 * 
 * Validates refresh tokens and verifies them against Redis storage.
 * Used in token refresh flow to prevent token reuse.
 * 
 * @param {Request} req - Express request object
 * @param {Response} _res - Express response object
 * @param {NextFunction} next - Express next function
 * @throws {401} - Invalid or expired refresh token
 * @throws {500} - Redis connection error
 */
export const refreshTokenMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return next(new errorResponse("No refresh token provided", 401));
  }

  const result = safeVerify(() => jwtOptions.verifyRefreshToken(refreshToken));
  if (!result.ok) {
    return next(new errorResponse("Invalid or expired refresh token", 401));
  }

  const { email } = result.value;

  redis
    .getValue(`refreshToken:${email}`)
    .then((storedToken: unknown) => {
      if (!storedToken || storedToken !== refreshToken) {
        return next(new errorResponse("Invalid or expired refresh token", 401));
      }

      const authReq = req as AuthRequest;
      authReq.user = result.value;
      next();
    })
    .catch(() => {
      next(new errorResponse("Redis error", 500));
    });
};

// Helper function untuk aman tanpa try-catch
function safeVerify<T>(fn: () => T): { ok: true; value: T } | { ok: false } {
  try {
    const value = fn();
    return { ok: true, value };
  } catch {
    return { ok: false };
  }
}
