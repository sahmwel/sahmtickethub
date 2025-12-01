// src/app/api/create-event/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { createTransporter } from "@/lib/nodemailer";
import { emailAccounts } from "@/lib/emailConfig";
import { eventCreatedTemplate } from "@/lib/emailTemplates/eventCreated";

interface CreateEventRequest {
  title: string;
  description?: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  state?: string;
  price?: string;
  image?: string;
  featured?: boolean;
  trending?: boolean;
  is_new?: boolean;
  sponsored?: boolean;
  organizer_id: string;
  organizer_name?: string; // optional to personalize email
  organizer_email: string; // email to send notification
  eventUrl?: string; // optional link to view event
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateEventRequest = await req.json();
    const { title, date, venue, city, organizer_id, organizer_email, organizer_name, eventUrl } = body;

    // Required fields check
    if (!title || !date || !venue || !city || !organizer_id || !organizer_email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert event into Supabase
    const { data, error } = await supabase
      .from("events")
      .insert([body])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Send organizer notification email
    const transporter = createTransporter("info"); // use info account
    await transporter.sendMail({
      from: `"Sahm Ticket Hub" <${emailAccounts.info.user}>`,
      to: organizer_email,
      subject: `Your Event "${title}" is Created!`,
      html: eventCreatedTemplate({
        organizerName: organizer_name,
        eventTitle: title,
        eventDate: date,
        eventTime: body.time,
        eventVenue: venue,
        eventCity: city,
        eventPrice: body.price,
        eventUrl,
      }),
    });

    return NextResponse.json({ message: "Event created and email sent", event: data?.[0] });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
