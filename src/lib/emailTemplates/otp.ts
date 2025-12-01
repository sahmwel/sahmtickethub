import { baseTemplate } from "./index";


interface OTPTemplateProps {
  name?: string;
  otp: string;
  expiresIn?: number;
}

/**
 * OTP / Verification code email template
 */
export const otpTemplate = ({
  name,
  otp,
  expiresIn = 5,
}: OTPTemplateProps) => {
  return baseTemplate({
    title: "Your Verification Code",
    preheader: `Your Sahm Ticket Hub OTP is ${otp}`,
    children: `
      <div style="text-align:center; margin-bottom:24px;">
        <img src="https://sahmtickethub.online/logo-white.png" alt="Sahm Ticket Hub" style="max-width:120px; margin-bottom:12px;" />
        <h1 style="font-size:22px; font-weight:800; margin:0; color:#111827;">
          Welcome to Sahm Ticket Hub
        </h1>
      </div>

      <p style="color:#374151; font-size:15px; line-height:1.6; text-align:center;">
        ${name ? `Hi <strong>${name}</strong>,` : "Hello,"}<br/>
        Use the verification code below to continue.
      </p>

      <div style="text-align:center; margin:24px 0;">
        <div style="display:inline-block; padding:16px 28px; background:linear-gradient(90deg,#7c3aed,#ec4899); color:white; border-radius:12px; font-size:32px; font-weight:800; letter-spacing:4px;">
          ${otp}
        </div>
      </div>

      <p style="color:#374151; font-size:14px; text-align:center;">
        This code expires in <strong>${expiresIn} minutes</strong>.
      </p>

      <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;" />

      <p style="color:#6b7280; font-size:13px; text-align:center;">
        If you didn't request this, you can safely ignore this email.
      </p>
    `,
  });
};
