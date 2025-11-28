import { environment } from "./environment";

export const rabbitmqConfig = {
  url: environment.amqpUrl,
  queue: environment.amqpQueue,
};
