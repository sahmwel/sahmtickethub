// src/app/api/subscribe-newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { createTransporter } from "@/lib/nodemailer";
import { emailAccounts } from "@/lib/emailConfig";
import { newsletterTemplate } from "@/lib/emailTemplates";

interface SubscribeNewsletterRequest {
  email: string;
  name?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: SubscribeNewsletterRequest = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Save subscriber to Supabase
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .upsert([{ email, name }])
      .select(); // return inserted row

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send welcome email
    const transporter = createTransporter("hello");
    await transporter.sendMail({
      from: `"Sahm Ticket Hub" <${emailAccounts.hello.user}>`,
      to: email,
      subject: "Welcome to Sahm Ticket Hub Newsletter",
      html: newsletterTemplate({
        name,
        title: "Welcome to Sahm Ticket Hub!",
        content: `Hi ${name ?? "there"}, thank you for subscribing to our newsletter! Stay tuned for updates, offers, and upcoming events.`,
        ctaText: "Visit Sahm Ticket Hub",
        ctaUrl: "https://sahmtickethub.online",
      }),
    });

    return NextResponse.json({
      message: "Subscribed successfully",
      subscriber: data?.[0],
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
