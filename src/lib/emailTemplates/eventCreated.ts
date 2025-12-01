// src/lib/emailTemplates/eventCreated.ts
import { baseTemplate } from "./index";

interface EventCreatedTemplateProps {
  organizerName?: string;
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  eventVenue: string;
  eventCity: string;
  eventPrice?: string;
  eventUrl?: string; // URL to view the event
}

export const eventCreatedTemplate = ({
  organizerName,
  eventTitle,
  eventDate,
  eventTime,
  eventVenue,
  eventCity,
  eventPrice,
  eventUrl,
}: EventCreatedTemplateProps) => {
  return baseTemplate({
    title: `Your Event "${eventTitle}" is Created!`,
    preheader: `Your event "${eventTitle}" has been successfully created.`,
    childrenHtml: `
      <!-- Logo -->
      <div style="text-align:center; margin-bottom:24px;">
        <img src="https://sahmtickethub.online/logo-white.png" alt="Sahm Ticket Hub" style="max-width:120px; margin-bottom:12px;" />
      </div>

      <h1 style="font-size:22px; font-weight:800; margin-bottom:16px;">Event Created Successfully ✅</h1>

      <p style="font-size:16px; color:#374151;">
        ${organizerName ? `Hi <strong>${organizerName}</strong>,` : "Hello,"}<br/>
        Your event "<strong>${eventTitle}</strong>" has been successfully created and is now live.
      </p>

      <div style="background:#f9fafb; border-radius:12px; padding:20px; margin-top:16px;">
        <p style="margin:6px 0; font-size:15px; color:#374151;">
          📅 <strong>${eventDate}</strong><br/>
          ⏰ ${eventTime ?? "TBD"}<br/>
          📍 ${eventVenue}, ${eventCity}<br/>
          💰 Price: ${eventPrice ?? "Free"}
        </p>
      </div>

      ${
        eventUrl
          ? `<div style="text-align:center; margin-top:24px;">
              <a href="${eventUrl}" class="btn" style="background:linear-gradient(90deg,#6D28D9,#EC4899); color:white; text-decoration:none; font-weight:700; padding:14px 24px; border-radius:10px;">
                View Event
              </a>
            </div>`
          : ""
      }

      <p style="font-size:14px; color:#374151; margin-top:20px;">
        Thank you for using Sahm Ticket Hub! 🎉
      </p>
    `,
  });
};
