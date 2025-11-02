/**
 * Password Hashing Utility
 * 
 * Provides secure password hashing and validation using bcrypt.
 * Uses industry-standard practices for password security.
 * 
 * Features:
 * - Secure salt generation
 * - Configurable work factor
 * - Async password comparison
 * - Type-safe interface
 * 
 * @module bcrypt.util
 */

import bcrypt from "bcrypt";

/**
 * Password Bcrypt Manager
 * Handles password hashing operations with secure defaults
 */
class PasswordBcrypt {
  /** Number of salt rounds for hashing (12 is industry standard as of 2025) */
  private readonly saltRounds = 12;

  /**
   * Generates a secure hash from a plain password
   * 
   * @param {string} plainPassword - The password to hash
   * @returns {Promise<string>} Hashed password
   */
  public generateHash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  /**
   * Validates a plain password against a hash
   * 
   * @param {string} plainPassword - The password to verify
   * @param {string} hashedPassword - The hash to verify against
   * @returns {Promise<boolean>} True if password matches
   */
  public isPasswordValid(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

export const passwordBcrypt = new PasswordBcrypt();
