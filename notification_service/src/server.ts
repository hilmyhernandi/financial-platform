import { web } from "./web.js";
import { environment } from "./config/environment.js";
import { logger } from "./core/logger/index.js";
import { rabbitMQConnection } from "./connections/rabbitmq.connections.js";

let server: ReturnType<typeof web.listen> | null = null;

function startServer() {
  server = web.listen(environment.port, () => {
    logger.info(`Server is running on port ${environment.port}`);
  });

  server.on("error", (err) => {
    logger.error("Server error:", err.message);
  });

  // graceful shutdown
  const shutdown = async () => {
    logger.info("Shutdown signal received, closing server...");
    try {
      if (server) {
        server.close(() => logger.info("HTTP server closed"));
      }
      await rabbitMQConnection.disconnect();
      logger.info("RabbitMQ connection closed");
      process.exit(0);
    } catch (err) {
      logger.error("Error during shutdown:", (err as Error).message);
      process.exit(1);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer();
