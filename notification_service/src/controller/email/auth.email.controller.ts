import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async_Handler.middleware.js";
import { renderSigninAttemptEmail } from "../../templates/email/signinAttempt.template.js";
import { renderPasswordVerifyEmail } from "../../templates/email/passwordVerify.template.js";
import { publishEmailToQueue } from "../../event/email/email.publisher.js";
import { AUTH_EMAIL_CONSTANTS } from "../../constants/authentications_email.constants.js";

export const sendEmailSigninAttempt = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, name, ip, userAgent, actionUrl, time } = req.body;

    const { subject, html } = renderSigninAttemptEmail({
      name,
      email,
      ip,
      userAgent,
      actionUrl,
      time,
    });

    // Enqueue email job for asynchronous processing by the consumer
    await publishEmailToQueue({ to: email, subject, html });

    res.status(202).json({ message: AUTH_EMAIL_CONSTANTS.MESSAGES_SUCCESS.EMAIL_QUEUED_SIGNIN });
  }
);

export const sendEmailPasswordVerify = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, name, code, expiresInMinutes, actionUrl } = req.body;

    const { subject, html } = renderPasswordVerifyEmail({
      name,
      email,
      code,
      expiresInMinutes,
      actionUrl,
    });

    // Enqueue email job for asynchronous processing by the consumer
    await publishEmailToQueue({ to: email, subject, html });

    res.status(202).json({ message: AUTH_EMAIL_CONSTANTS.MESSAGES_SUCCESS.EMAIL_QUEUED_PASSWORD_VERIFY });
  }
);
