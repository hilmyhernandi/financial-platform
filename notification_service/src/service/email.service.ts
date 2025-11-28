import { IMailService } from "../interfaces/email.interface.js";
import { MailOptions } from "../types/email.types.js";
import { mailTransporter } from "../config/email.config.js";
import { logger } from "../core/logger/index.js";

class MailService implements IMailService {
  public async sendMail({ to, subject, html }: MailOptions): Promise<void> {
    try {
      await mailTransporter.sendMail({
        from: `"Support MyApp" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
      });

      logger.info(`Email terkirim ke ${to} | Subject: ${subject}`);
    } catch (error) {
      logger.error(
        `Failed to send email to ${to}: ${(error as Error).message}`
      );
      throw new Error("Failed to send email, please try again.");
    }
  }
}

export const mailService = new MailService();
