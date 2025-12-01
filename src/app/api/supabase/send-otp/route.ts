// src/app/api/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { createTransporter } from "@/lib/nodemailer";
import { emailAccounts } from "@/lib/emailConfig";
import { otpTemplate } from "@/lib/emailTemplates";

interface OtpRequestBody {
  email: string;
  name?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: OtpRequestBody = await req.json();

    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { email, name } = body;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresInMinutes = Number(process.env.OTP_EXPIRES_IN) || 5;

    // Save OTP to Supabase
    const { data, error } = await supabase
      .from("otp_codes")
      .insert([
        {
          email,
          otp,
          expires_at: new Date(Date.now() + expiresInMinutes * 60 * 1000),
        },
      ])
      .select(); // returns the inserted row

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send OTP email
    const transporter = createTransporter("noreply");
    await transporter.sendMail({
      from: `"Sahm Ticket Hub" <${emailAccounts.noreply.user}>`,
      to: email,
      subject: "Your Verification Code",
      html: otpTemplate({ name, otp, expiresIn: expiresInMinutes }),
    });

    return NextResponse.json({
      message: "OTP sent successfully",
      otpId: data?.[0]?.id,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
