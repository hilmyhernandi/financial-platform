/**
 * Notification Service Constants
 * 
 * Contains all constants related to notification service including:
 * - Success/failure messages
 * - Email templates
 * - Notification types
 * - Log messages
 */
export const NOTIFICATION_CONSTANTS = {
  // Response Messages
  MESSAGES: {
    VERIFICATION_SENT: "📩 Verification email sent to %s",
    VERIFICATION_FAILED: "Failed to send verification email to %s: %s",
    PASSWORD_RESET_SENT: "🔐 Password verification email sent to %s",
    PASSWORD_RESET_FAILED: "Failed to send password reset email to %s: %s"
  },

  // Endpoints
  ENDPOINTS: {
    VERIFY_EMAIL: "/verify-email",
    RESET_PASSWORD: "/reset-password"
  },

  // Headers
  HEADERS: {
    CONTENT_TYPE: "application/json",
    AUTH_PREFIX: "Bearer"
  }
} as const;