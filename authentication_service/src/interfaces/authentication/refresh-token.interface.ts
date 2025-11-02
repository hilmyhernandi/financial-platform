/**
 * Interface untuk response saat refresh token
 */
export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

/**
 * Interface untuk data yang disimpan di Redis terkait refresh token
 */
export interface StoredRefreshTokenData {
  userId: string;
  email: string;
  tokenFamily: string;
  createdAt: string;
}

/**
 * Interface untuk decoded refresh token payload
 */
export interface RefreshTokenPayload {
  email: string;
  mode: string;
  tokenFamily?: string;
  iat?: number;
  exp?: number;
}