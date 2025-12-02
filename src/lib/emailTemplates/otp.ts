// src/lib/emailTemplates/otp.ts

import { baseTemplate } from "./index";

interface OTPTemplateProps {
  name?: string;
  otp: string;
  expiresIn?: number;
}

/**
 * Welcome + OTP email for Organizers
 */
export const otpTemplate = ({
  name,
  otp,
  expiresIn = 5,
}: OTPTemplateProps) => {
  return baseTemplate({
    title: "Welcome to Sahm Ticket Hub – Verify Your Organizer Account",
    preheader: `Hi ${name || "Organizer"}! Your verification code is ${otp}`,

    childrenHtml: `
      <div style="text-align:center; margin-bottom:32px;">
        <img 
          src="https://sahmtickethub.online/logo-white.png" 
          alt="Sahm Ticket Hub" 
          style="max-width:140px; margin-bottom:16px;" 
        />
        <h1 style="font-size:26px; font-weight:900; margin:0; color:#111827; line-height:1.2;">
          Welcome to Sahm Ticket Hub!
        </h1>
        <p style="font-size:18px; color:#6b7280; margin:12px 0 0;">
          You're one step away from creating amazing events
        </p>
      </div>

      <p style="color:#374151; font-size:16px; line-height:1.7; text-align:center; margin:24px 0;">
        ${name ? `Hi <strong>${name}</strong>,` : "Hello Organizer,"}<br/><br/>
        Thank you for joining <strong>Sahm Ticket Hub</strong> — the fastest-growing event platform in the region.<br/>
        Use the code below to verify your account and start creating events instantly.
      </p>

      <div style="text-align:center; margin:32px 0;">
        <div style="display:inline-block; padding:18px 32px; background:linear-gradient(90deg,#7c3aed,#ec4899); color:white; border-radius:16px; font-size:36px; font-weight:900; letter-spacing:8px; box-shadow:0 10px 25px rgba(124,58,237,0.3);">
          ${otp}
        </div>
      </div>

      <p style="color:#374151; font-size:15px; text-align:center; margin:32px 0;">
        This code expires in <strong>${expiresIn} minutes</strong> for security.
      </p>

      <div style="background:#f8fafc; border-radius:12px; padding:24px; margin:32px 0; text-align:center;">
        <p style="margin:0; color:#475569; font-size:15px; line-height:1.6;">
          Once verified, you can:
        </p>
        <ul style="margin:16px 0 0; padding-left:20px; text-align:left; display:inline-block; color:#475569;">
          <li>Create unlimited events</li>
          <li>Manage tickets & attendees</li>
          <li>Track real-time sales & analytics</li>
          <li>Get paid instantly</li>
        </ul>
      </div>

      <hr style="margin:40px 0; border:none; border-top:2px solid #e5e7eb;" />

      <p style="color:#6b7280; font-size:14px; text-align:center; line-height:1.6;">
        Need help? Reply to this email or contact us at <strong>info@sahmtickethub.online</strong><br/>
        We're excited to see your events come to life!
      </p>

      <p style="color:#8b5cf6; font-size:14px; text-align:center; margin-top:24px; font-weight:600;">
        — The Sahm Ticket Hub Team
      </p>
    `,
  });
};