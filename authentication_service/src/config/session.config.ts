import session from "express-session";
import { env } from "./env.config.js";

const isProduction = env.mode === "production";

const sessionConfig = session({
  secret: env.sessionKey!,
  resave: false,
  saveUninitialized: false,
  unset: "keep",
  cookie: {
    httpOnly: true,
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000,
  },
});

export default sessionConfig;
