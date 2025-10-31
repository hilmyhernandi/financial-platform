import { env } from "../config/env.config.js";

// Export notification service base config. Keep API key out of query strings for security.
export const notifEmailService = {
  baseUri: env.notificationService?.uri || "",
  endpoints: {
    ATTEMPT_SIGNIN: "/email/attempt-signin",
    VERIFY_PASSWORD: "/email/verify-password",
  },
  apiKey: env.notificationService?.apiKey || "",
};
