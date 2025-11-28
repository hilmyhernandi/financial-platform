import * as amqp from "amqplib";
import { rabbitmqConfig } from "../config/rabbitmq.config.js";
import { AmqpConnection, AmqpChannel } from "../types/rabbitmq.types.js";
import { loggerRabbit } from "../core/logger/index.js";

/**
 * @class RabbitMQConnection
 * @classdesc
 * Singleton class that manages a global connection to RabbitMQ.
 *
 * Primary goals:
 * - Avoid creating duplicate connections (single shared connection across app)
 * - Handle errors and auto-reconnect when connection is lost
 * - Provide ready-to-use channel for publishing/consuming messages
 *
 * Features:
 * - Race Condition Guard
 * - Auto Reconnect
 * - Exponential Backoff Retry
 * - Graceful Shutdown
 */
export class RabbitMQConnection {
  private static instance: RabbitMQConnection | null = null;

  /** Active RabbitMQ connection object */
  private connection: AmqpConnection | null = null;

  /** Active channel used for communication */
  private channel: AmqpChannel | null = null;

  /** Ongoing promise while a connection is being established (prevents race conditions) */
  private connecting: Promise<void> | null = null;

  /** Private constructor to prevent direct instantiation */
  private constructor() {}

  /**
   * Get the singleton RabbitMQConnection instance.
   *
   * @returns {RabbitMQConnection} the global instance used across the application
   */
  public static getInstance(): RabbitMQConnection {
    if (!RabbitMQConnection.instance) {
      RabbitMQConnection.instance = new RabbitMQConnection();
    }
    return RabbitMQConnection.instance;
  }

  /**
   * Create or retrieve an active connection to RabbitMQ.
   *
   * @async
   * @param {number} [retryCount=0] number of reconnect attempts (used for exponential backoff)
   * @returns {Promise<AmqpChannel>} a ready-to-use channel for RabbitMQ communication
   *
   * @example
   * const channel = await rabbitMQConnection.connect();
   * await channel.sendToQueue("notification_queue", Buffer.from("Hello"));
   */
  public async connect(retryCount = 0): Promise<AmqpChannel> {
    // If already connected, return the existing channel
    if (this.channel) return this.channel;

    // If a connection is already being created, wait for it to finish
    if (this.connecting) {
      await this.connecting;
      return this.channel!;
    }

    // Mark that a connection is being created (avoid race condition)
    this.connecting = (async () => {
      try {
        // Membuat koneksi baru ke RabbitMQ
        const newConnection = await amqp.connect(rabbitmqConfig.url);

        // Pendengar error koneksi
        newConnection.on("error", (err) => {
          loggerRabbit.error("Error koneksi:", err.message);
          this.reset();
          setTimeout(() => this.reconnect(), 5000);
        });

        // Pendengar penutupan koneksi
        newConnection.on("close", () => {
          loggerRabbit.warn("Koneksi ditutup, mencoba untuk terhubung kembali");
          this.reset();
          setTimeout(() => this.reconnect(), 5000);
        });

        // Membuat channel baru dari koneksi
        const newChannel = await newConnection.createChannel();

        // Pastikan queue ada (durable = true agar tetap ada saat restart)
        await newChannel.assertQueue(rabbitmqConfig.queue, { durable: true });
        loggerRabbit.info(
          `Queue terhubung ke ${rabbitmqConfig.url} dan siap: "${rabbitmqConfig.queue}"`
        );

        // Store connection and channel
        this.connection = newConnection;
        this.channel = newChannel;
      } catch (err) {
        // Saat gagal, coba lagi dengan exponential backoff
        const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
        loggerRabbit.error(
          `Gagal terhubung (percobaan ${retryCount + 1}): ${
            (err as Error).message
          }`
        );
        loggerRabbit.info(`Mencoba lagi dalam ${delay / 1000} detik`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        await this.connect(retryCount + 1);
      } finally {
        // Reset flag connecting setelah selesai
        this.connecting = null;
      }
    })();

    await this.connecting;
    return this.channel!;
  }

  /**
   * Menghapus reference koneksi & channel saat koneksi rusak atau tertutup.
   * @private
   */
  private reset(): void {
    this.connection = null;
    this.channel = null;
  }

  /**
   * Mencoba melakukan reconnect otomatis.
   * @private
   */
  private async reconnect(): Promise<void> {
    try {
      await this.connect();
    } catch (err) {
      loggerRabbit.error("Reconnect gagal:", (err as Error).message);
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  /**
   * Menutup koneksi RabbitMQ secara aman & normal.
   * @async
   * @returns {Promise<void>}
   * @example
   * await rabbitMQConnection.disconnect();
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
      loggerRabbit.info("Koneksi & channel ditutup dengan normal");
    } catch (err) {
      loggerRabbit.error("Gagal menutup koneksi:", (err as Error).message);
    }
  }
}

/**
 * Instance tunggal RabbitMQ yang bisa langsung digunakan di seluruh aplikasi.
 *
 * @example
 * import { rabbitMQConnection } from "./connections/rabbitmq.connections.js";
 * const channel = await rabbitMQConnection.connect();
 */
export const rabbitMQConnection = RabbitMQConnection.getInstance();
