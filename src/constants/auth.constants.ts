export const AUTH_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_MESSAGE: "too many login attempts, please try again after 15 minutes",
  REFRESH_TOKEN_EXPIRY: 3600,
  PASSWORD_RESET_EXPIRY: 300,
  
  // Response Messages
  MESSAGES: {
    USER_CREATED: "User created successfully",
    SIGNIN_SUCCESS: "Sign-in successfully",
    SIGNOUT_SUCCESS: "Sign-out successful",
    TOKEN_REFRESHED: "Token refreshed successfully",
    PASSWORD_UPDATED: "Password updated successfully",
    PASSWORD_RESET_SENT: "Password reset instructions sent to your email",
    INVALID_EMAIL: "invalid email",
    INVALID_PASSWORD: "invalid password",
    USER_NOT_FOUND: "User with this email does not exist",
    RELOGIN_REQUIRED: "please sign in again",
    UNAUTHORIZED: "Unauthorized access",
    TOKEN_EXPIRED: "Token has expired",
    INVALID_TOKEN: "Invalid token"
  },

  // Redis Keys
  REDIS_KEYS: {
    REFRESH_TOKEN: (email: string) => `refreshToken:${email}`,
    CHANGE_PASSWORD: (email: string) => `changePassword:${email}`
  }
} as const;