export const BOOKINGS_STORAGE_KEY = "glm-booking-requests";

export type BookingRequest = {
  id: string; createdAt: string; status: "pending" | "completed";
  name: string; phone: string; email: string; service: string; date: string;
  time: string; passengers: string; origin: string; destination: string;
  reference: string; notes: string;
};

export function getBookings(): BookingRequest[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || "[]"); }
  catch { return []; }
}

export function saveBooking(booking: BookingRequest) {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([booking, ...getBookings()]));
}
