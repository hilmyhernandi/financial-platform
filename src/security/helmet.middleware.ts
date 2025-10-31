import helmet from "helmet";
import { helmetOption } from "../config/helmet.config.js";

export const helmetMiddleware = helmet(helmetOption);
