export type Event = {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
};

export type ApiResponse<T = unknown> = {
  message?: string;
  error?: string;
  data?: T;
};

/**
 * Handles fetch responses with type safety
 */
const handleResponse = async <T = unknown>(res: Response): Promise<ApiResponse<T>> => {
  try {
    const json = await res.json();
    return json as ApiResponse<T>;
  } catch {
    return { error: "Invalid JSON response" };
  }
};

/**
 * Send OTP email
 */
export const sendOtp = async (
  email: string,
  name?: string
): Promise<ApiResponse<{ otpId?: string }>> => {
  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  return handleResponse<{ otpId?: string }>(res);
};

/**
 * Send ticket email
 */
export const sendTicket = async (
  email: string,
  name: string,
  event: Event
): Promise<ApiResponse<{ ticketCode: string }>> => {
  const res = await fetch("/api/send-ticket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, event }),
  });
  return handleResponse<{ ticketCode: string }>(res);
};

/**
 * Subscribe to newsletter
 */
export const subscribeNewsletter = async (
  email: string,
  name?: string
): Promise<ApiResponse<{ id: string; email: string; name?: string }>> => {
  const res = await fetch("/api/subscribe-newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  return handleResponse<{ id: string; email: string; name?: string }>(res);
};

/**
 * Create a new event (organizer)
 */
export const createEvent = async (
  event: Omit<Event, "id"> & {
    state?: string;
    price?: string;
    image?: string;
    featured?: boolean;
    trending?: boolean;
    is_new?: boolean;
    sponsored?: boolean;
    organizer_id: string;
    organizer_name?: string;
    organizer_email: string;
    eventUrl?: string;
  }
): Promise<ApiResponse<{ id: string; title: string }>> => {
  const res = await fetch("/api/create-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  return handleResponse<{ id: string; title: string }>(res);
};
