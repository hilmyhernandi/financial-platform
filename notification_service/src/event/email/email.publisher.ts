import { queueClient } from "../../adapters/rabbitmq.adapter.js";
import { rabbitmqConfig } from "../../config/rabbitmq.config.js";
import { MailOptions } from "../../types/email.types.js";


export async function publishEmailToQueue(emailData: MailOptions) {
  queueClient.publish(
    rabbitmqConfig.queue,
    Buffer.from(JSON.stringify(emailData)),
    { persistent: false }
  );
}
