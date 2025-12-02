'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Organizer {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export default function OrganizerDetailPage() {
  const pathname = usePathname();
  const id = pathname?.split('/').pop();

  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect must be called unconditionally — at the top level
  useEffect(() => {
    // Handle invalid or missing ID
    if (!id || id === 'organizer') {
      setError('Invalid organizer ID');
      setLoading(false);
      return;
    }

    const fetchOrganizer = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('organizers')
          .select('id, name, email')
          .eq('id', id)
          .single<Organizer>();

        if (error) throw error;
        if (!data) throw new Error('Organizer not found');

        setOrganizer(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load organizer');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizer();
  }, [id]); // Re-run only when id changes

  // Render states — now safe because hooks are always called
  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !organizer) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Organizer not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{organizer.name}</h1>
      <div className="space-y-3 text-lg">
        <p>
          <span className="font-medium text-gray-600">Email:</span>{' '}
          <a href={`mailto:${organizer.email}`} className="text-blue-600 hover:underline">
            {organizer.email}
          </a>
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">ID:</span> {organizer.id}
        </p>
      </div>
    </div>
  );
}