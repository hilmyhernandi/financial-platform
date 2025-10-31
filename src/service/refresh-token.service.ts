import { v4 as uuidv4 } from 'uuid';
import { redisService } from '../controller/auth.controller.js';
import { AUTH_CONSTANTS } from '../constants/auth.constants.js';
import { StoredRefreshTokenData, RefreshTokenPayload } from '../interfaces/authentication/refresh-token.interface.js';
import { errorResponse } from '../utils/error/error.js';

export class RefreshTokenService {
  /**
   * Creates a new token family for refresh tokens
   */
  static generateTokenFamily(): string {
    return uuidv4();
  }

  /**
   * Stores refresh token data in Redis
   */
  static async storeRefreshTokenData(
    email: string,
    userId: string,
    tokenFamily: string
  ): Promise<void> {
    const data: StoredRefreshTokenData = {
      userId,
      email,
      tokenFamily,
      createdAt: new Date().toISOString()
    };

    await redisService.setValue(
      AUTH_CONSTANTS.REDIS_KEYS.REFRESH_TOKEN(email),
      data,
      AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY
    );
  }

  /**
   * Validates refresh token
   */
  static async validateRefreshToken(
    email: string,
    payload: RefreshTokenPayload
  ): Promise<boolean> {
    const storedData = await redisService.getValue(
      AUTH_CONSTANTS.REDIS_KEYS.REFRESH_TOKEN(email)
    );

    if (!storedData) {
      throw new errorResponse(AUTH_CONSTANTS.MESSAGES.TOKEN_EXPIRED, 401);
    }

    const data: StoredRefreshTokenData = JSON.parse(storedData as string);

    // Validate token family to prevent token reuse
    if (payload.tokenFamily && payload.tokenFamily !== data.tokenFamily) {
      throw new errorResponse(AUTH_CONSTANTS.MESSAGES.INVALID_TOKEN, 401);
    }

    return true;
  }

  /**
   * Removes refresh token from Redis
   */
  static async removeRefreshToken(email: string): Promise<void> {
    await redisService.deleteKey(AUTH_CONSTANTS.REDIS_KEYS.REFRESH_TOKEN(email));
  }
}