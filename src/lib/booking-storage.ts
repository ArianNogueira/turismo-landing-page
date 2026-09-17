export const BOOKINGS_STORAGE_KEY = "glm-booking-requests";

export type BookingRequest = {
  id: string; code: string; createdAt: string; status: "pending" | "completed";
  name: string; phone: string; email: string; service: string; date: string;
  time: string; passengers: string; origin: string; destination: string;
  reference: string; notes: string;
};

export function getBookings(): BookingRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || "[]") as Array<BookingRequest & { code?: string }>;
    return bookings.map((booking, index) => ({
      ...booking,
      code: booking.code || formatBookingCode(bookings.length - index),
    }));
  }
  catch { return []; }
}

export function saveBooking(booking: BookingRequest) {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([booking, ...getBookings()]));
}

export function formatBookingCode(sequence: number) {
  return `GML-${String(sequence).padStart(4, "0")}`;
}

export function getNextBookingCode() {
  const highestSequence = getBookings().reduce((highest, booking) => {
    const sequence = Number(booking.code.match(/^GML-(\d+)$/)?.[1] || 0);
    return Math.max(highest, sequence);
  }, 0);

  return formatBookingCode(highestSequence + 1);
}
