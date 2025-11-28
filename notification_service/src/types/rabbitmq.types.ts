import type { ChannelModel, Channel } from "amqplib";

/**
 * Explicit aliases for amqplib types to avoid confusing inference
 * from ReturnType/Awaited on overloaded functions.
 *
 * - AmqpConnection maps to the ChannelModel returned by `amqplib.connect`
 * - AmqpChannel is the regular Channel returned by `createChannel()`
 */
export type AmqpConnection = ChannelModel;

export type AmqpChannel = Channel;
