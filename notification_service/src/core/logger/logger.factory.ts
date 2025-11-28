import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { ensureDir } from "../../utils/file.utils.js";
import { environment } from "../../config/environment.js";

/**
 * Factory Pattern:
 * Membuat dan mengonfigurasi instance logger baru berdasarkan kebutuhan.
 */
export class LoggerFactory {
  static createLogger(logDirectory: string, label?: string): winston.Logger {
    ensureDir(logDirectory);

    const isProduction = environment.mode === "production";
    const level = environment.logLevel || (isProduction ? "info" : "debug");

    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.label({ label }),
      ...(isProduction ? [] : [winston.format.colorize()]),
      winston.format.printf(({ timestamp, level, message, label }) => {
        const tag = label ? `[${label}]` : "";
        return `[${timestamp}] ${level.toUpperCase()} ${tag}: ${message}`;
      })
    );

    return winston.createLogger({
      level,
      format: logFormat,
      transports: [
        // Console output (dev only)
        ...(isProduction
          ? []
          : [new winston.transports.Console({ format: logFormat })]),

        // File-based logs per level
        new winston.transports.File({
          filename: path.join(logDirectory, "error.log"),
          level: "error",
        }),
        new winston.transports.File({
          filename: path.join(logDirectory, "warn.log"),
          level: "warn",
        }),
        new winston.transports.File({
          filename: path.join(logDirectory, "info.log"),
          level: "info",
        }),

        // Daily rotation log
        new DailyRotateFile({
          filename: path.join(logDirectory, "daily-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          maxSize: "10m",
          maxFiles: "7d",
        }),
      ],
    });
  }
}
