/**
 * Environment Configuration
 * 
 * Centralizes all environment variable access and provides type-safe defaults.
 * Supports both development and production environments.
 * 
 * Required Environment Variables:
 * - NODE_ENV: "development" | "production"
 * - PORT: Server port number
 * - MONGODB_URI: Database connection string
 * - REDIS_* : Redis connection details (in production)
 * - SESSIONS_SECRET: Session encryption key
 * - CSRF_SECRET: CSRF token secret
 * - NOTIFICATION_SERVICE_*: Notification service configuration
 * 
 * @module env.config
 */

import "dotenv/config";

const isProd = process.env.NODE_ENV === "production";

/**
 * Environment configuration object
 * Provides typed access to all environment variables with safe defaults
 */
export const env = {
  port: process.env.PORT || 3000,
  mode: process.env.NODE_ENV || "production",
  redis: {
    host: isProd ? process.env.REDIS_HOST! : "localhost",
    port: isProd ? parseInt(process.env.REDIS_PORT!) : 6379,
    username: isProd ? process.env.REDIS_USERNAME! : "default",
    password: isProd ? process.env.REDIS_PASSWORD! : "default",
  },
  sessionKey: process.env.SESSIONS_SECRET!,
  csrfSecret: process.env.CSRF_SECRET!,
  accessSecret: process.env.secret!,
  refreshSecret: process.env.refreshSecret!,
  notificationService: {
    apiKey: process.env.NOTIFICATION_SERVICE_API_KEY!,
    uri: process.env.NOTIFICATION_SERVICE_URI!,
  },
};
