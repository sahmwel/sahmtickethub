import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch events', details: err }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, date, organizer_id, ticket_sold, revenue, status } = body;

    const { data, error } = await supabase
      .from('events')
      .insert([{ title, date, organizer_id, ticket_sold, revenue, status }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create event', details: err }, { status: 500 });
  }
}
