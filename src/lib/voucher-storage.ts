import { databaseError, getSupabase } from "@/lib/supabase";
import { priceInCents, type Voucher } from "@/lib/voucher-pdf";

export type SavedVoucher = Voucher & { id: string; bookingId: string | null; savedAt: string };
type VoucherRow = Omit<Voucher, "price" | "passengers" | "time" | "issuedAt" | "arrivalTime"> & {
  id: string; booking_id: string | null; price: number; passengers: number;
  time: string | null; issued_at: string; arrival_time: string | null; saved_at: string;
};

export function voucherFromRow(row: VoucherRow): SavedVoucher {
  const { booking_id, issued_at, arrival_time, saved_at, passengers, price, time, ...fields } = row;
  return {
    ...fields, bookingId: booking_id, issuedAt: issued_at, arrivalTime: arrival_time?.slice(0, 5) || "",
    savedAt: saved_at, passengers: String(passengers), time: time?.slice(0, 5) || "",
    price: Number(price).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  };
}

export async function getVouchers(): Promise<SavedVoucher[]> {
  const vouchers: SavedVoucher[] = [];
  const pageSize = 100;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await getSupabase().from("vouchers").select("*")
      .order("saved_at", { ascending: false }).order("id").range(offset, offset + pageSize - 1);
    if (error) throw databaseError(error);
    vouchers.push(...(data as VoucherRow[]).map(voucherFromRow));
    if (data.length < pageSize) return vouchers;
  }
}

export async function saveVoucher(v: Voucher, bookingId: string | null): Promise<SavedVoucher> {
  const { data, error } = await getSupabase().from("vouchers").upsert({
    code: v.code.trim(), booking_id: bookingId, client: v.client.trim(), phone: v.phone.trim(),
    service: v.service.trim() || "Transfer Privativo", date: v.date, time: v.time || null,
    passengers: Number(v.passengers), origin: v.origin.trim(), destination: v.destination.trim(),
    vehicle: v.vehicle.trim(), driver: v.driver.trim(), price: priceInCents(v.price) / 100,
    payment: v.payment, notes: v.notes.trim(), issued_at: v.issuedAt,
    arrival_time: v.arrivalTime || null, saved_at: new Date().toISOString(),
  }, { onConflict: "code" }).select("*").single();
  if (error) throw databaseError(error);
  return voucherFromRow(data as VoucherRow);
}
