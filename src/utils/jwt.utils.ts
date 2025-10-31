/**
 * JWT Manager Utility
 * 
 * Handles JSON Web Token operations for authentication and authorization:
 * - Token generation (access and refresh tokens)
 * - Token verification
 * - Secure error handling
 * 
 * Features:
 * - Separate secrets for access and refresh tokens
 * - Configurable expiration times
 * - Type-safe payload handling
 * - Safe verification without try-catch
 * 
 * @module jwt.utils
 */

import jwt from "jsonwebtoken";
import { errorResponse } from "./error/error.js";

import { env } from "../config/env.config.js";
import { IJwtPayload } from "../interfaces/authentication/jwt-auth.interface.js";

/**
 * JWT Manager Class
 * Handles all JWT operations with secure defaults
 */
class jwtManager {
  private readonly secret: string;
  private readonly refreshSecret: string;
  private readonly expiresIn: number;
  private readonly refreshExpiresIn: number;

  constructor(
    secret: string = env.accessSecret,
    expiresIn: number = 60 * 5,
    refreshSecret: string = env.refreshSecret,
    refreshExpiresIn: number = 60 * 5
  ) {
    this.secret = secret;
    this.expiresIn = expiresIn;
    this.refreshSecret = refreshSecret;
    this.refreshExpiresIn = refreshExpiresIn;
  }

  // Generate Access Token
  generateToken(payload: IJwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  // Verify Access Token (tanpa try-catch)
  verifyToken(token: string): IJwtPayload {
    const decoded = this.safeVerify(
      token,
      this.secret,
      "invalid or expired token"
    );
    if (typeof decoded === "string") {
      throw new errorResponse("invalid token payload", 401);
    }
    return decoded as IJwtPayload;
  }

  // Generate Refresh Token
  generateRefreshToken(payload: IJwtPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    });
  }

  // Verify Refresh Token (tanpa try-catch)
  verifyRefreshToken(token: string): IJwtPayload {
    const decoded = this.safeVerify(
      token,
      this.refreshSecret,
      "invalid or expired refresh token"
    );
    if (typeof decoded === "string") {
      throw new errorResponse("invalid refresh token payload", 401);
    }
    return decoded as IJwtPayload;
  }

  // Helper function: verifikasi aman tanpa try-catch
  private safeVerify(token: string, secret: string, errorMessage: string) {
    let result: string | jwt.JwtPayload | undefined;

    jwt.verify(token, secret, (err, decoded) => {
      if (err) throw new errorResponse(errorMessage, 401);
      result = decoded;
    });

    if (!result) throw new errorResponse(errorMessage, 401);
    return result;
  }
}

export const jwtOptions = new jwtManager();
