import { NextRequest, NextResponse } from "next/server";
import { createTransporter } from "@/lib/nodemailer";
import { otpTemplate } from "@/lib/emailTemplates/otp";
import { ticketTemplate } from "@/lib/emailTemplates/ticket";
import { eventCreatedTemplate } from "@/lib/emailTemplates/eventCreated";
import { newsletterTemplate } from "@/lib/emailTemplates/newsletter";

// Event interface
interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  price?: string;
  url?: string;
}

// Email payloads
interface EmailPayloads {
  otp: { otp: string; name?: string; expiresIn?: number };
  ticket: {
    name: string;
    event: {
      title: string;
      date: string;
      time: string;
      venue: string;
      ticketCode: string;
    };
  };
  event: {
    name?: string;
    event: Event;
  };
  newsletter: {
    name?: string;
    title: string;
    content: string; // HTML
    ctaText?: string;
    ctaUrl?: string;
  };
}

// Discriminated union request body
type EmailRequestBody =
  | { type: "otp"; email: string; data: EmailPayloads["otp"] }
  | { type: "ticket"; email: string; data: EmailPayloads["ticket"] }
  | { type: "event"; email: string; data: EmailPayloads["event"] }
  | { type: "newsletter"; email: string; data: EmailPayloads["newsletter"] };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EmailRequestBody;
    const { email, type, data } = body;

    if (!email || !type) {
      return NextResponse.json({ error: "Missing email or type" }, { status: 400 });
    }

    const transporter = createTransporter("noreply");

    let subject: string;
    let html: string;

    // Type-safe handling using discriminated union
    if (type === "otp") {
      subject = "Your OTP Code";
      html = otpTemplate(data);
    } else if (type === "ticket") {
      subject = `Your Ticket for ${data.event.title}`;
      html = ticketTemplate({
        name: data.name,
        eventTitle: data.event.title,
        eventDate: data.event.date,
        eventTime: data.event.time,
        eventVenue: data.event.venue,
        ticketCode: data.event.ticketCode,
      });
    } else if (type === "event") {
      subject = `Event Created: ${data.event.title}`;
      html = eventCreatedTemplate({
        organizerName: data.name,
        eventTitle: data.event.title,
        eventDate: data.event.date,
        eventTime: data.event.time,
        eventVenue: data.event.venue,
        eventCity: data.event.city,
        eventPrice: data.event.price,
        eventUrl: data.event.url,
      });
    } else if (type === "newsletter") {
      subject = data.title;
      html = newsletterTemplate(data);
    } else {
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    await transporter.sendMail({
      from: `"Sahm Ticket Hub" <${process.env.EMAIL_NOREPLY}>`,
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ message: "Email sent" });
  } catch (err) {
    console.error("Failed to send email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
