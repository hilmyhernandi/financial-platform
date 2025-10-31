/**
 * Financial Platform Server
 * 
 * This is the main entry point for the Financial Platform application.
 * It handles server initialization, Redis connection, and graceful shutdown.
 * 
 * Features:
 * - Express web server setup
 * - Redis connection management
 * - Graceful shutdown handling
 * - Error logging and monitoring
 * - Process signal handling (SIGTERM, SIGINT)
 * 
 * @module server
 */

import { web } from "./web.js";
import { redisConnection } from "./connections/redis.connection.js";
import { logger } from "./config/logger.config.js";

/** Default server port */
const port = 4000;

/**
 * Initializes and starts the server with all required connections and handlers
 * 
 * @throws Will throw an error if Redis connection fails or server cannot start
 * @returns Promise that resolves when server is successfully started
 */
async function startServer() {
  try {
    // Explicitly connect to Redis
    await redisConnection.connect();
    
    // Verify Redis connection
    await redisConnection.ping();
    
    const server = web.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });

    server.on("error", (err) => {
      logger.error("Server error", {
        message: err.message,
        stack: err.stack,
      });
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      logger.info("Shutting down server...");
      server.close(async () => {
        try {
          await redisConnection.quit();
          logger.info("Server shutdown complete");
          process.exit(0);
        } catch (err) {
          logger.error("Error during shutdown", {
            message: err instanceof Error ? err.message : 'Unknown error',
            stack: err instanceof Error ? err.stack : undefined,
          });
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    logger.error("Failed to start server", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}

startServer().catch((error) => {
  logger.error("Unhandled error during server startup", {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
  });
  process.exit(1);
});
