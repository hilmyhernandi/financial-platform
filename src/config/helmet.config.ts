import { HelmetOptions } from "helmet";
import { env } from "./env.config.js";

const isProduction = env.mode === "production";

export const helmetOption: HelmetOptions = {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": isProduction
        ? ["'self'"]
        : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "style-src": isProduction
        ? ["'self'", "https:", "'unsafe-inline'"]
        : ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "https:"],
      "connect-src": ["'self'", "https:"],
      "font-src": ["'self'", "https:", "data:"],
      "object-src": ["'none'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"],
      "frame-ancestors": ["'self'"],
      "upgrade-insecure-requests": [],
    },
  },
  crossOriginEmbedderPolicy: isProduction ? true : false,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "sameorigin" },
  hsts: isProduction
    ? { maxAge: 63072000, includeSubDomains: true, preload: true }
    : false,
  noSniff: true,
  referrerPolicy: {
    policy: isProduction ? "strict-origin-when-cross-origin" : "no-referrer",
  },
  hidePoweredBy: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  originAgentCluster: true,
};
