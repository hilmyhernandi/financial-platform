import { rabbitMQConnection } from "../connections/rabbitmq.connections.js";
import {
  IQueueClient,
  ConsumeMessage,
} from "../interfaces/infra/queue.interface.js";
import type { AmqpChannel } from "../types/rabbitmq.types.js";

import { loggerRabbit } from "../core/logger/index.js";

export class RabbitMqAdapter implements IQueueClient {
  private channel: AmqpChannel | null = null;
  private activeConsumers = new Set<string>();

  private async ensureChannel(): Promise<AmqpChannel> {
    if (this.channel) return this.channel;

    this.channel = await rabbitMQConnection.connect();

    this.channel.on("close", () => {
      this.channel = null;
      this.activeConsumers.clear();
    });

    this.channel.on("error", (err) => {
      loggerRabbit.error("[RabbitMQ] Channel error:", err.message);
    });

    return this.channel;
  }

  /**
   * Mempublikasikan pesan ke queue RabbitMQ
   * @returns boolean - true jika publish dimulai (async, bukan blocking)
   */
  publish(queue: string, content: Buffer, options?: any): boolean {
    (async () => {
      const ch = await this.ensureChannel();
      await ch.assertQueue(queue, { durable: true });
      ch.sendToQueue(queue, content, options);
    })();

    return true;
  }

  async consume(
    queue: string,
    onMessage: (msg: ConsumeMessage | null) => Promise<void>,
    options?: any
  ): Promise<void> {
    const ch = await this.ensureChannel();
    await ch.assertQueue(queue, { durable: true });

    if (this.activeConsumers.has(queue)) {
      return;
    }

    this.activeConsumers.add(queue);
    await ch.prefetch(1);

    await ch.consume(
      queue,
      async (msg) => {
        await onMessage(msg);
      },
      { noAck: false, ...options }
    );
  }

  ack(msg: ConsumeMessage): void {
    if (!msg || !this.channel) return;
    this.channel.ack(msg);
  }

  nack(msg: ConsumeMessage, allUpTo = false, requeue = true): void {
    if (!msg || !this.channel) return;
    this.channel.nack(msg, allUpTo, requeue);
  }

  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    this.channel = null;
    this.activeConsumers.clear();
  }
}

export const queueClient = new RabbitMqAdapter();
