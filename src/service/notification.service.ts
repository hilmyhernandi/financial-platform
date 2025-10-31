/**
 * Notification Service
 * 
 * This service handles email notifications by integrating with an external email service.
 * It supports sending verification emails and password reset notifications.
 * 
 * Required Environment Variables:
 * - NOTIF_EMAIL_SERVICE_BASE_URI: Base URL of the notification service
 * - NOTIF_EMAIL_SERVICE_API_KEY: API key for authentication
 * 
 * Error Handling:
 * - Network errors (ECONNREFUSED, ETIMEDOUT)
 * - Authentication errors (401 Unauthorized, 403 Forbidden)
 * - Rate limiting (429 Too Many Requests)
 * - Service errors (500 Internal Server Error, 503 Service Unavailable)
 * 
 * All errors are logged using Winston logger and propagated up for handling
 */

import axios from "axios";
import { notifEmailService } from "../utils/member.path.utils.js";
import type {
  VerificationPayload,
  PasswordVerificationPayload,
} from "../interfaces/notification/notification.interface.js";
import { logger } from "../config/logger.config.js";
import { NOTIFICATION_CONSTANTS } from "../constants/notification.constants.js";

/**
 * Builds the complete URL for notification service endpoints
 * @param path - The endpoint path from notifEmailService.endpoints
 * @returns Full URL including base URI and endpoint path
 */
const buildUrl = (path: string) => `${notifEmailService.baseUri}${path}`;

/**
 * Sends a verification email to the user during sign-in attempt
 * 
 * @param payload - The verification email payload containing:
 *   - email: User's email address
 *   - token: Verification token
 *   - Additional verification metadata
 * 
 * @returns Promise that resolves when email is sent
 * @throws Will throw and log errors for network, auth, or service issues
 * 
 * @example
 * ```typescript
 * await sendVerificationEmail({
 *   email: "user@example.com",
 *   token: "verification-token"
 * });
 * ```
 */
export function sendVerificationEmail(payload: VerificationPayload) {
  return axios
    .post(buildUrl(notifEmailService.endpoints.ATTEMPT_SIGNIN), payload, {
      headers: {
        Authorization: `${NOTIFICATION_CONSTANTS.HEADERS.AUTH_PREFIX} ${notifEmailService.apiKey}`,
        "Content-Type": NOTIFICATION_CONSTANTS.HEADERS.CONTENT_TYPE,
      },
    })
    .then(() => {
      logger.info(NOTIFICATION_CONSTANTS.MESSAGES.VERIFICATION_SENT.replace('%s', payload.email));
    })
    .catch((error) => {
      logger.error(
        NOTIFICATION_CONSTANTS.MESSAGES.VERIFICATION_FAILED.replace('%s', payload.email).replace('%s', error.message)
      );
      throw error;
    });
}

/**
 * Sends a password verification/reset email to the user
 * 
 * @param payload - The password verification email payload containing:
 *   - email: User's email address
 *   - token: Password reset token
 *   - Additional reset flow metadata
 * 
 * @returns Promise that resolves when email is sent
 * @throws Will throw and log errors for network, auth, or service issues
 * 
 * @example
 * ```typescript
 * await sendPasswordVerificationEmail({
 *   email: "user@example.com",
 *   token: "reset-token"
 * });
 * ```
 */
export function sendPasswordVerificationEmail(payload: PasswordVerificationPayload) {
  return axios
    .post(buildUrl(notifEmailService.endpoints.VERIFY_PASSWORD), payload, {
      headers: {
        Authorization: `${NOTIFICATION_CONSTANTS.HEADERS.AUTH_PREFIX} ${notifEmailService.apiKey}`,
        "Content-Type": NOTIFICATION_CONSTANTS.HEADERS.CONTENT_TYPE,
      },
    })
    .then(() => {
      logger.info(NOTIFICATION_CONSTANTS.MESSAGES.PASSWORD_RESET_SENT.replace('%s', payload.email));
    })
    .catch((error) => {
      logger.error(
        NOTIFICATION_CONSTANTS.MESSAGES.PASSWORD_RESET_FAILED.replace('%s', payload.email).replace('%s', error.message)
      );
      throw error;
    });
}
