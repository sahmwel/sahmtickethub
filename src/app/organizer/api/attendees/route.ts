import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT and get user info
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizerId = userData.user.id;

    // Fetch events for this organizer
    const { data: events, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("organizer_id", organizerId);

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 400 });
    }

    const eventIds = events.map(e => e.id);
    if (eventIds.length === 0) return NextResponse.json([]);

    // Fetch attendees for all organizer events
    const { data: attendees, error: attendeeError } = await supabase
      .from("attendees")
      .select("*")
      .in("event_id", eventIds);

    if (attendeeError) {
      return NextResponse.json({ error: attendeeError.message }, { status: 400 });
    }

    return NextResponse.json(attendees);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch attendees" },
      { status: 500 }
    );
  }
}
