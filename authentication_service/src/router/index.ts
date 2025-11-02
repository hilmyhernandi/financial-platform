import { Router } from "express";
import { routerRegistry } from "./registry.js";
export const router = Router();

router.use("/token", routerRegistry.apiRouter);
router.use("/auth", routerRegistry.authRouter);
