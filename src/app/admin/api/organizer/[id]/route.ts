import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  const { id } = params;
  try {
    const { data, error } = await supabase
      .from('organizers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Use `data` in response
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch organizer', details: err }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string }}) {
  const { id } = params;
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('organizers')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Use `data` in response
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update organizer', details: err }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string }}) {
  const { id } = params;
  try {
    const { error } = await supabase
      .from('organizers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete organizer', details: err }, { status: 500 });
  }
}
