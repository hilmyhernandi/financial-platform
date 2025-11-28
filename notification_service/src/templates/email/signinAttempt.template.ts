/**
 * Template for sign-in attempt notification email.
 * Returns an object with `subject` and `html` properties ready to be passed to mail transporter.
 */
import type { SigninAttemptData } from "../../interfaces/email.interface.js";

export function renderSigninAttemptEmail(data: SigninAttemptData) {
  const displayName = data.name || data.email;
  const time = data.time || new Date().toISOString();

  const subject = `Sign-in attempt detected for ${displayName}`;

  const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height:1.4;">
    <h2 style="color:#111;">Sign-in attempt detected</h2>
    <p>Hello ${displayName},</p>
    <p>We detected a sign-in attempt for your account (${data.email}) at <strong>${time}</strong>.</p>
    <table style="border-collapse:collapse; margin:12px 0;">
      <tr><td style="padding:4px 8px; font-weight:600;">IP</td><td style="padding:4px 8px;">${data.ip || 'Unknown'}</td></tr>
      <tr><td style="padding:4px 8px; font-weight:600;">Device / Agent</td><td style="padding:4px 8px;">${data.userAgent || 'Unknown'}</td></tr>
    </table>

    ${data.actionUrl ? `<p>If this wasn't you, you can review or secure your account here: <a href="${data.actionUrl}">Review activity</a></p>` : `<p>If this wasn't you, please secure your account immediately by changing your password.</p>`}

    <p style="font-size:12px; color:#666;">If you recognize this activity, you can safely ignore this message.</p>

    <hr style="border:none; border-top:1px solid #eee; margin:16px 0;" />
    <p style="font-size:12px; color:#999;">This is an automated message — do not reply to this email.</p>
  </div>
  `;

  return { subject, html };
}
