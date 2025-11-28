import express, { Application } from "express";
import { router } from "./router/index";
import { errorHandlers } from "./middleware/error-Handlers.middleware";
import { helmetMiddleware } from "./security/helmet.middlewares";

export const web: Application = express();
web.disable("x-powered-by");
web.use(express.json());
web.use(express.urlencoded({ extended: true }));

web.use("/api/v1", router);
web.use(helmetMiddleware);
web.use(errorHandlers);
