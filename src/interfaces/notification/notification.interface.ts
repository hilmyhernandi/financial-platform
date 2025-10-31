/**
 * Type definitions for notification service payloads
 * These interfaces define the data structures used for sending emails through the notification service.
 */

/**
 * Base payload for verification emails
 * Contains the minimum required field for any email notification
 * 
 * @property email - The recipient's email address (must be valid email format)
 */
export interface VerificationPayload {
  email: string;
}

/**
 * Extended payload for password verification/reset emails
 * Includes all base verification fields plus password-specific data
 * 
 * @property email - Inherited from VerificationPayload
 * @property token - Unique token for password verification/reset
 */
export interface PasswordVerificationPayload extends VerificationPayload {
  token: string;
}
