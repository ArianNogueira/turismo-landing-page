"use client";

import { Bell, CalendarDays, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BookingRequest } from "@/lib/booking-storage";

const readBookingsKey = "glm:read-booking-notifications";

function loadReadBookings(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(readBookingsKey) || "[]");
    return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === "string") : [];
  } catch { return []; }
}

export function BookingNotifications({ bookings, loading, error, onSelect }: {
  bookings: BookingRequest[];
  loading: boolean;
  error: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [readStateLoaded, setReadStateLoaded] = useState(false);
  const unreadCount = bookings.filter(booking => !readIds.includes(booking.id)).length;
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setReadIds(loadReadBookings());
    setReadStateLoaded(true);
    function sync(event: StorageEvent) {
      if (event.key === readBookingsKey || event.key === null) setReadIds(loadReadBookings());
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function selectNotification(id: string) {
    const next = [...new Set([...loadReadBookings(), ...readIds, id])];
    setReadIds(next);
    try { localStorage.setItem(readBookingsKey, JSON.stringify(next)); }
    catch { /* Keep read state in memory when browser storage is unavailable. */ }
    setOpen(false);
    onSelect(id);
  }

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    function outside(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={container} className="relative" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}>
      <button ref={trigger} type="button" onClick={() => setOpen(current => !current)}
        aria-label={`Notificações: ${readStateLoaded ? unreadCount : 0} agendamentos não lidos${error ? ", falha ao atualizar" : ""}`}
        aria-expanded={open} aria-controls="booking-notifications" aria-haspopup="dialog"
        className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#c9dde3] bg-white text-green shadow-sm transition hover:bg-[#f3f8fa] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-light/30">
        <Bell size={21} />
        {((readStateLoaded && unreadCount > 0) || error) && <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b74324] px-1 text-[10px] font-bold text-white">{error ? "!" : unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>
      <span className="sr-only" role="status">{loading || !readStateLoaded ? "Carregando agendamentos" : error ? "Não foi possível atualizar as notificações" : `${readStateLoaded ? unreadCount : 0} agendamentos não lidos`}</span>
      {open && (
        <section id="booking-notifications" role="dialog" aria-labelledby="booking-notifications-title"
          className="absolute right-0 top-14 z-40 w-[min(380px,calc(100vw-28px))] overflow-hidden rounded-2xl border border-[#d7e7eb] bg-white shadow-2xl">
          <header className="flex items-center justify-between gap-3 border-b border-[#d7e7eb] p-4">
            <div><h2 id="booking-notifications-title" className="font-bold text-ink">Agendamentos pendentes</h2><p className="mt-1 text-xs text-muted">Pedidos mais recentes primeiro</p></div>
            <button ref={closeButton} type="button" aria-label="Fechar notificações" onClick={() => { setOpen(false); trigger.current?.focus(); }} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f3f8fa] text-green"><X size={18} /></button>
          </header>
          <div className="max-h-[min(420px,60vh)] overflow-y-auto p-3">
            {loading && <p role="status" className="p-3 text-sm text-muted">Carregando…</p>}
            {error && <p role="alert" className="mb-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Não foi possível atualizar os avisos. A lista pode estar desatualizada. Tentaremos novamente automaticamente.</p>}
            {!loading && !error && bookings.length === 0 && <p className="p-5 text-center text-sm text-muted">Nenhum agendamento pendente.</p>}
            {bookings.map(booking => (
              <button key={booking.id} type="button" onClick={() => selectNotification(booking.id)} className="mb-2 block w-full rounded-xl border border-[#d7e7eb] p-3 text-left transition last:mb-0 hover:border-green-light hover:bg-[#f3f8fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-light">
                <span className="flex items-center gap-2 text-xs font-bold text-green-light"><CalendarDays size={15} /> Solicitação de agendamento</span>
                <span className="mt-1 block text-xs text-muted">{readIds.includes(booking.id) ? "Lido" : "Novo"}</span>
                <strong className="mt-2 block break-words text-sm text-ink">{booking.name}</strong>
                <span className="mt-1 block break-words text-xs text-muted">{booking.origin} → {booking.destination}</span>
                <span className="mt-1 block text-xs text-muted">{booking.date.split("-").reverse().join("/")}{booking.time ? ` às ${booking.time}` : ""} · {booking.passengers} passageiro(s)</span>
                <span className="mt-2 block text-xs font-bold text-green">Preparar voucher →</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
