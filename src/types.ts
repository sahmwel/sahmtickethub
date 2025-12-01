// src/types.ts
export interface NavItem {
  label: string;
  icon?: React.ReactNode; // optional for flexibility
  route: string;
}

export interface Organizer {
  id: string;
  name: string;
  email: string;
  events?: number;
  revenue?: string;
}

export interface Event {
  id: string;
  title: string;
  organizer_id: string;
  revenue: number;
}
