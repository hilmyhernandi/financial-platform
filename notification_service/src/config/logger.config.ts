import { resolvePath, getDirname } from "../utils/path.utils.js";

const __dirname = getDirname(import.meta.url);

/**
 * Konfigurasi direktori log utama untuk berbagai komponen aplikasi.
 */

export const loggerConfig = {
  baseDir: resolvePath(__dirname, "../../logs"),
  paths: {
    server: resolvePath(__dirname, "../../logs/server"),
    rabbitmq: resolvePath(__dirname, "../../logs/rabbitmq"),
    workerQueue: resolvePath(__dirname, "../../logs/worker-queue"),
    emailConsumer: resolvePath(__dirname, "../../logs/email-consumer"),
  },
};
