import { LoggerManager } from "./logger.manager.js";
import { loggerConfig } from "../../config/logger.config.js";

/**
 * Logger utama untuk aplikasi server & komponen lainnya.
 * Gunakan ini di seluruh project agar log terorganisir dan konsisten.
 */
export const logger = LoggerManager.getInstance(
  loggerConfig.paths.server,
  "SERVER"
);

export const loggerRabbit = LoggerManager.getInstance(
  loggerConfig.paths.rabbitmq,
  "RABBITMQ"
);

export const loggerWorkerQueue = LoggerManager.getInstance(
  loggerConfig.paths.workerQueue,
  "WORKER-QUEUE"
);

export const loggerEmailConsumer = LoggerManager.getInstance(
  loggerConfig.paths.emailConsumer,
  "EMAIL-CONSUMER"
);
