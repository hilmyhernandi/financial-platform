/**
 * Template for password verification (one-time code / password reset verification).
 * Returns an object with `subject` and `html` properties ready to be passed to mail transporter.
 */
import type { PasswordVerifyData } from "../../interfaces/email.interface.js";

export function renderPasswordVerifyEmail(data: PasswordVerifyData) {
  const displayName = data.name || data.email;
  const expiresText = data.expiresInMinutes
    ? `${data.expiresInMinutes} minutes`
    : "a limited time";

  const subject = `Your verification code for ${displayName}`;

  const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height:1.4;">
    <h2 style="color:#111;">Verify your password change</h2>
    <p>Hello ${displayName},</p>
    <p>Use the verification code below to proceed with your password change or verification. The code is valid for <strong>${expiresText}</strong>.</p>

    <div style="display:flex; align-items:center; justify-content:center; margin:18px 0;">
      <div style="font-size:24px; letter-spacing:6px; background:#f7f7f7; padding:12px 18px; border-radius:6px;">
        <strong>${data.code}</strong>
      </div>
    </div>

    ${
      data.actionUrl
        ? `<p>Or click this link to verify directly: <a href="${data.actionUrl}">Verify password</a></p>`
        : ""
    }

    <p style="font-size:12px; color:#666;">If you didn't request this code, please ignore this message or contact support.</p>

    <hr style="border:none; border-top:1px solid #eee; margin:16px 0;" />
    <p style="font-size:12px; color:#999;">This is an automated message — do not reply to this email.</p>
  </div>
  `;

  return { subject, html };
}
