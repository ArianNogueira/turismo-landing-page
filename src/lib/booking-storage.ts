import { databaseError, getSupabase } from "@/lib/supabase";

export type BookingRequest = {
  id: string; code: string; createdAt: string; status: "pending" | "completed";
  name: string; phone: string; email: string; service: string; date: string;
  time: string; passengers: string; origin: string; destination: string;
  reference: string; notes: string;
};

export type NewBooking = Omit<BookingRequest, "id" | "code" | "createdAt" | "status">;
type BookingRow = Omit<BookingRequest, "createdAt" | "time" | "passengers"> & {
  created_at: string; time: string | null; passengers: number;
};

export async function getBookings(): Promise<BookingRequest[]> {
  const bookings: BookingRequest[] = [];
  const pageSize = 100;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await getSupabase().from("bookings").select("*")
      .eq("status", "pending").order("created_at", { ascending: false }).order("id")
      .range(offset, offset + pageSize - 1);
    if (error) throw databaseError(error);
    const rows = data as BookingRow[];
    bookings.push(...rows.map(({ created_at, time, passengers, ...row }) => ({
      ...row, createdAt: created_at, time: time?.slice(0, 5) || "", passengers: String(passengers),
    })));
    if (rows.length < pageSize) return bookings;
  }
}

export async function saveBooking(booking: NewBooking) {
  const passengers = Number(booking.passengers);
  if (!Number.isInteger(passengers) || passengers < 1) throw new Error("Informe um n\u00famero v\u00e1lido de passageiros.");
  // Public users can submit requests, but cannot read customer data.
  const { error } = await getSupabase().from("bookings").insert({
    name: booking.name.trim(), phone: booking.phone.trim(), email: booking.email.trim(),
    service: booking.service.trim(), date: booking.date, time: booking.time || null,
    passengers, origin: booking.origin.trim(), destination: booking.destination.trim(),
    reference: booking.reference.trim(), notes: booking.notes.trim(),
  });
  if (error) throw databaseError(error);
}
