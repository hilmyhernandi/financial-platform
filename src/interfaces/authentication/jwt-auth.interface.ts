/**
 * Interface untuk JWT payload
 * @property email - Email pengguna
 * @property mode - Mode aplikasi (development/production)
 * @property tokenFamily - ID unik untuk grup token (digunakan untuk refresh token)
 * @property name - Nama pengguna (opsional)
 * @property iat - Issued at timestamp (otomatis ditambahkan oleh JWT)
 * @property exp - Expiration timestamp (otomatis ditambahkan oleh JWT)
 */
export interface IJwtPayload {
  email: string;
  mode: string;
  tokenFamily?: string;
  name?: string;
  purpose?: "access" | "refresh" | "password-reset";  // Tipe token
  iat?: number;
  exp?: number;
}

/**
 * Interface untuk JWT manager
 */
export interface JwtOptions {
  generateToken(payload: IJwtPayload): string;
  generateRefreshToken(payload: IJwtPayload): string;
  verifyToken(token: string): IJwtPayload;
}
