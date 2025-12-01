// src/lib/emailTemplates/index.ts

export { ticketTemplate } from "./ticket";
export { newsletterTemplate } from "./newsletter";
export { otpTemplate } from "./otp"; // make sure this exists

export const baseTemplate = ({
  title,
  preheader,
  childrenHtml,
}: {
  title?: string;
  preheader?: string;
  childrenHtml: string;
}) => {
  const gradientStart = "#6D28D9"; // purple-600
  const gradientEnd = "#EC4899";   // pink-500

  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${title ?? "Sahm Ticket Hub"}</title>
    <style>
      body {
        margin:0; padding:0; -webkit-text-size-adjust:100%;
        background:#f5f7fa; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111827;
      }
      table { border-collapse:collapse; }
      img { border:0; -ms-interpolation-mode:bicubic; display:block; }
      a { color: inherit; text-decoration:none; }
      .btn { display:inline-block; padding:14px 22px; border-radius:10px; font-weight:700; text-decoration:none; }
      @media (max-width:600px) {
        .container { width:100% !important; padding:18px !important; }
        .content { padding:20px !important; }
      }
    </style>
  </head>

  <body>
    <!-- Preheader for inbox preview -->
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
      ${preheader ?? "Welcome to Sahm Ticket Hub"}
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f5f7fa; width:100%;">
      <tr>
        <td align="center" style="padding:36px 16px;">
          <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 30px rgba(16,24,40,0.08);">

            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(90deg, ${gradientStart}, ${gradientEnd}); padding:22px; text-align:center;">
                <img src="https://sahmtickethub.online/logo-white.png" alt="Sahm Ticket Hub" width="180" style="display:block; margin:0 auto; height:auto;" />
              </td>
            </tr>

            <!-- Main content -->
            <tr>
              <td class="content" style="padding:32px; font-size:16px; line-height:1.6;">
                ${childrenHtml}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f3f4f6; padding:16px; text-align:center; color:#6b7280; font-size:13px;">
                © ${new Date().getFullYear()} Sahm Ticket Hub · 
                <a href="https://sahmtickethub.online" target="_blank" style="color:#6b7280; text-decoration:none;">sahmtickethub.online</a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
