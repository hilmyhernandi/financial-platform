import "dotenv/config";

export const environment = {
  port: Number(process.env.PORT),
  amqpUrl: process.env.AMQP_URL!,
  amqpQueue: String(process.env.AMQP_QUEUE),
  mode: process.env.NODE_ENV || "development",
  logLevel:
    (process.env.LOG_LEVEL as "debug" | "info" | "warn" | "error") || "debug",
  email: {
    emailUser: process.env.EMAIL_USER!,
    emailPass: process.env.EMAIL_PASS!,
  },
  secret: {
    apikey: process.env.APIKEY!,
  },
};
