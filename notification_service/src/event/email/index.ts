import { startEmailConsumer } from "./email.consumer.js";
import { rabbitMQConnection } from "../../connections/rabbitmq.connections.js";

async function bootstrap() {
  await startEmailConsumer();
}

async function gracefulShutdown() {
  await rabbitMQConnection.disconnect();
  process.exit(0);
}

bootstrap();

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
