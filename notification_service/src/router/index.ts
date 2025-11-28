import { Router } from "express";
import { registryRouter } from "./registry";
import { verifyApiKey } from "../middleware/api-Key.middlewares";
export const router = Router();

router.use("/auth/email", verifyApiKey, registryRouter.authEmailRouter);
