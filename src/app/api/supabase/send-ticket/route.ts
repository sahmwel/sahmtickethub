// src/app/api/send-ticket/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { createTransporter } from "@/lib/nodemailer";
import { emailAccounts } from "@/lib/emailConfig";
import { ticketTemplate } from "@/lib/emailTemplates";

interface EventPayload {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
}

interface SendTicketRequest {
  email: string;
  name: string;
  event: EventPayload;
}

export async function POST(req: NextRequest) {
  try {
    const body: SendTicketRequest = await req.json();
    const { email, name, event } = body;

    if (!email || !name || !event?.id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate unique ticket code
    const ticketCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Save ticket to Supabase
    const { data, error } = await supabase
      .from("tickets")
      .insert([
        {
          email,
          event_id: event.id,
          ticket_code: ticketCode,
        },
      ])
      .select(); // returns the inserted row

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send ticket email
    const transporter = createTransporter("noreply");
    await transporter.sendMail({
      from: `"Sahm Ticket Hub" <${emailAccounts.noreply.user}>`,
      to: email,
      subject: `Your Ticket for ${event.title}`,
      html: ticketTemplate({
        name,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time ?? "TBD",
        eventVenue: `${event.venue}, ${event.city}`,
        ticketCode,
      }),
    });

    return NextResponse.json({
      message: "Ticket sent successfully",
      ticketCode,
      ticket: data?.[0],
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
