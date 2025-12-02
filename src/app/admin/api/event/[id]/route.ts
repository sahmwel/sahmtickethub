// src/app/admin/api/event/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Define the row type (you can also import it from generated types)
type EventRow = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  location: string | null;
  venue: string | null;
  tickets: number | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

type EventUpdate = Partial<Omit<EventRow, 'id' | 'created_at'>>;

// GET
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('events')                    // ← Remove the generic here
    .select('*')
    .eq('id', id)
    .single<EventRow>();               // ← Type the result instead

  if (error || !data) {
    return NextResponse.json(
      { error: 'Event not found', details: error?.message },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

// PATCH
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: EventUpdate;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (Object.keys(body).length === 0) {
    return NextResponse.json({ error: 'No fields provided' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('events')
    .update(body)
    .eq('id', id)
    .select()
    .single<EventRow>();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || 'Event not found' },
      { status: error ? 400 : 404 }
    );
  }

  return NextResponse.json(data);
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json(
      { error: 'Delete failed', details: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}