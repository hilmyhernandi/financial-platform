import type { ConsumeMessage } from "amqplib";

export interface IQueueClient {
  publish(queue: string, content: Buffer, options?: any): boolean;
  consume(
    queue: string,
    onMessage: (msg: ConsumeMessage | null) => Promise<void>,
    options?: any
  ): Promise<void>;
  ack(msg: ConsumeMessage): void;
  nack(msg: ConsumeMessage, allUpTo?: boolean, requeue?: boolean): void;
  close(): Promise<void>;
}

export type { ConsumeMessage };
