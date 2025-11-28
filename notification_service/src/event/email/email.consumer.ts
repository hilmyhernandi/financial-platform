import { rabbitmqConfig } from "../../config/rabbitmq.config.js";
import { mailService } from "../../service/email.service.js";
import { queueClient } from "../../adapters/rabbitmq.adapter.js";
import { rabbitMQConnection } from "../../connections/rabbitmq.connections.js";
import type { ConsumeMessage } from "amqplib";
import { loggerEmailConsumer } from "../../core/logger/index.js";

export async function startEmailConsumer() {
  await queueClient.consume(
    rabbitmqConfig.queue,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      const emailData = JSON.parse(msg.content.toString());
      
      await mailService.sendMail(emailData);

      queueClient.ack(msg);
      await rabbitMQConnection.disconnect();
    },
    { noAck: false }
  );

}
