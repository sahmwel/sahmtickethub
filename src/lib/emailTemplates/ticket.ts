import { baseTemplate } from "./index";

interface TicketTemplateProps {
  name: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  ticketCode: string;
}

/**
 * Ticket email HTML template
 */
export const ticketTemplate = ({
  name,
  eventTitle,
  eventDate,
  eventTime,
  eventVenue,
  ticketCode,
}: TicketTemplateProps) => {
  return baseTemplate({
    title: "Your Ticket is Ready! 🎟️",
    preheader: `Your ticket for ${eventTitle} is confirmed and ready to use.`,
    childrenHtml: `  <!-- <- changed from 'children' -->
      <div style="text-align:center; margin-bottom:24px;">
        <img src="https://sahmtickethub.online/logo-white.png" alt="Sahm Ticket Hub" style="max-width:120px; margin-bottom:12px;" />
        <h1 style="font-size:24px; font-weight:800; margin:0; color:#111827;">Your Ticket is Confirmed</h1>
      </div>

      <p style="font-size:16px; line-height:1.6; color:#374151; text-align:center; margin-bottom:20px;">
        Hi <strong>${name}</strong>,<br/>
        Thank you for your purchase! Here are your ticket details:
      </p>

      <div style="background:#f9fafb; border-radius:12px; padding:20px; margin-bottom:20px;">
        <h2 style="margin:0 0 12px; font-size:20px; font-weight:700; color:#111827;">${eventTitle}</h2>
        <p style="margin:6px 0; font-size:15px; color:#374151;">
          📅 <strong>${eventDate}</strong><br/>
          ⏰ ${eventTime}<br/>
          📍 ${eventVenue}
        </p>

        <div style="margin-top:20px; text-align:center;">
          <div style="display:inline-block; padding:16px 28px; border-radius:12px; background:linear-gradient(90deg,#7c3aed,#ec4899); color:#fff; font-size:22px; font-weight:700; letter-spacing:2px;">
            ${ticketCode}
          </div>
        </div>
      </div>

      <p style="font-size:14px; color:#6b7280; text-align:center; margin-bottom:0;">
        Show this code at the entrance for verification.<br/>
        Keep this email safe and do not share your ticket code with others.
      </p>
    `,
  });
};
