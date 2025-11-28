import { Router } from "express";
import * as AuthEmailController from "../../../controller/email/auth.email.controller.js";

export const authEmailRouter = Router();

authEmailRouter.post(
  "/signin/attempt",
  AuthEmailController.sendEmailSigninAttempt
);
authEmailRouter.post(
  "/password/verify",
  AuthEmailController.sendEmailPasswordVerify
);
