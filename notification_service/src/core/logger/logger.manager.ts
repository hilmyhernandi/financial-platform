import winston from "winston";
import { LoggerFactory } from "./logger.factory.js";

/**
 * LoggerManager bertanggung jawab untuk mengatur instance logger agar hanya dibuat satu kali per direktori log.
 * Mengimplementasikan pola Singleton secara internal menggunakan Map.
 */
export class LoggerManager {
  private static instances: Map<string, winston.Logger> = new Map();

  /**
   * Mengambil atau membuat instance logger berdasarkan direktori log.
   * @param logDir - Path direktori tempat file log disimpan.
   * @param label - Label opsional untuk membedakan sumber log (misal: SERVER, RABBITMQ).
   * @returns Instance `winston.Logger` yang unik per direktori.
   */
  static getInstance(logDir: string, label?: string): winston.Logger {
    if (!this.instances.has(logDir)) {
      const logger = LoggerFactory.createLogger(logDir, label);
      this.instances.set(logDir, logger);
    }
    return this.instances.get(logDir)!;
  }
}
