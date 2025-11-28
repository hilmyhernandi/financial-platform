import nodemailer from "nodemailer";
import { environment } from "./environment.js";

export const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: environment.email.emailUser,
    pass: environment.email.emailPass,
  },
});
