import { Router } from "express";
import {
  doubleCsrfProtection,
  sendCsrfToken,
} from "../security/csrf.middleware.js";

export const apiRouter = Router();
apiRouter.get("/csrf-token", doubleCsrfProtection, sendCsrfToken);
