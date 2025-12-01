import { baseTemplate } from "./index"; // or the correct path to your baseTemplate

export const newsletterTemplate = ({
  name,
  title,
  content,
  ctaText,
  ctaUrl,
}: {
  name?: string;
  title: string;
  content: string; // HTML content or text with <p> tags
  ctaText?: string;
  ctaUrl?: string;
}) => {
  return baseTemplate({
    title: title || "Sahm Ticket Hub Newsletter",
    preheader: title,
    childrenHtml: `
      <h1 style="font-size:22px; font-weight:800; margin:0 0 12px; color:#111827;">
        ${title}
      </h1>

      <p style="color:#374151; font-size:15px; line-height:1.6;">
        ${name ? `Hi <strong>${name}</strong>,` : "Hello,"}
      </p>

      <div style="color:#374151; font-size:15px; line-height:1.6; margin:16px 0;">
        ${content}
      </div>

      ${
        ctaText && ctaUrl
          ? `<div style="text-align:center; margin:24px 0;">
               <a href="${ctaUrl}" class="btn" style="background: linear-gradient(90deg,#6D28D9,#EC4899); color:white;">
                 ${ctaText}
               </a>
             </div>`
          : ""
      }

      <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;" />

      <p style="color:#6b7280; font-size:13px; text-align:center;">
        You are receiving this email because you subscribed to Sahm Ticket Hub Newsletter. 
        If you wish to unsubscribe, click <a href="#" style="color:#6D28D9;">here</a>.
      </p>
    `,
  });
};
