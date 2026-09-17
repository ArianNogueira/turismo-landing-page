"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckCircle2 } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { getNextBookingCode, saveBooking } from "@/lib/booking-storage";

const fieldClass = "mt-2 w-full rounded-xl border border-[#dce4e0] bg-white px-4 py-3 text-ink outline-none transition placeholder:text-[#9aa7a2] focus:border-green-light focus:ring-4 focus:ring-green-light/10";
const labelClass = "text-sm font-bold text-ink";

const travelOptions = [
  { label: "São Luís → Barreirinhas", origin: "São Luís", destination: "Barreirinhas" },
  { label: "Barreirinhas → São Luís", origin: "Barreirinhas", destination: "São Luís" },
  { label: "São Luís → Santo Amaro", origin: "São Luís", destination: "Santo Amaro" },
  { label: "Santo Amaro → São Luís", origin: "Santo Amaro", destination: "São Luís" },
  { label: "Aeroporto → Hotel", origin: "Aeroporto", destination: "Hotel" },
  { label: "Hotel → Aeroporto", origin: "Hotel", destination: "Aeroporto" },
];

export function BookingForm() {
  const [sent, setSent] = useState(false);
  const today = new Date();
  const minimumDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) || "");
    saveBooking({
      id: crypto.randomUUID(), code: getNextBookingCode(), createdAt: new Date().toISOString(), status: "pending",
      name: value("name"), phone: value("phone"), email: value("email"), service: value("route"),
      date: value("date"), time: value("time"), passengers: value("passengers"),
      origin: value("origin"), destination: value("destination"), reference: value("reference"), notes: value("notes"),
    });
    form.reset();
    setSent(true);
  }

  function handleTravelChange(event: ChangeEvent<HTMLSelectElement>) {
    const option = travelOptions.find((travel) => travel.label === event.target.value);
    const form = event.target.form;

    if (!option || !form) return;

    const origin = form.elements.namedItem("origin") as HTMLInputElement;
    const destination = form.elements.namedItem("destination") as HTMLInputElement;
    origin.value = option.origin;
    destination.value = option.destination;
  }

  function formatPhone(event: ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length > 3) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
    if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
    event.target.value = formatted;
  }

  return (
    <main className="min-h-screen bg-[#f8faf9] py-10 max-[620px]:py-6">
      <div className="mx-auto w-[min(900px,calc(100%-40px))] max-[620px]:w-[min(900px,calc(100%-28px))]">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 font-bold text-green-light hover:text-green"><ArrowLeft size={18} /> Voltar ao site</Link>
        <div className="overflow-hidden rounded-[28px] border border-[#e5ebe8] bg-white shadow-[0_20px_60px_rgba(25,45,38,.10)]">
          <header className="bg-green px-10 py-9 text-white max-[620px]:px-6">
            <CalendarDays className="mb-4 text-[#8dd8bd]" size={34} />
            <span className="text-xs font-extrabold uppercase tracking-[.18em] text-[#a9dec9]">Agendamento</span>
            <h1 className="mt-2 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight">Conte-nos sobre sua viagem</h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-[#d8e5df]">Preencha os dados para que a GLM prepare seu pré-voucher e confirme disponibilidade e valores.</p>
          </header>
          {sent ? (
            <div className="p-10 text-center max-[620px]:p-6">
              <CheckCircle2 className="mx-auto text-green-light" size={54} />
              <h2 className="mt-5 text-3xl font-bold">Solicitação recebida!</h2>
              <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted">Seus dados foram enviados para a preparação do pré-voucher. A GLM entrará em contato após completar as informações.</p>
              <button onClick={() => setSent(false)} className="mt-7 rounded-full bg-green px-6 py-3 font-bold text-white">Fazer outro agendamento</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 p-10 max-[700px]:grid-cols-1 max-[620px]:p-6">
              <label className={labelClass}>Nome completo *<input className={fieldClass} name="name" required /></label>
              <label className={labelClass}>WhatsApp *<input className={fieldClass} name="phone" type="tel" required inputMode="numeric" maxLength={16} placeholder="(98) 9 9999-9999" onChange={formatPhone} /></label>
              <label className={labelClass}>E-mail<input className={fieldClass} name="email" type="email" /></label>
              <label className={labelClass}>Data da viagem *<input className={fieldClass} name="date" type="date" min={minimumDate} required /></label>
              <label className={labelClass}>Horário desejado<input className={fieldClass} name="time" type="time" /></label>
              <label className={labelClass}>Número de passageiros *<input className={fieldClass} name="passengers" type="number" min="1" required /></label>
              <label className={`${labelClass} col-span-2 max-[700px]:col-span-1`}>Rota da viagem *
                <select className={fieldClass} name="route" required defaultValue="" onChange={handleTravelChange}>
                  <option value="" disabled>Selecione a rota</option>
                  {travelOptions.map((travel) => <option key={travel.label} value={travel.label}>{travel.label}</option>)}
                </select>
              </label>
              <label className={labelClass}>Local de saída *<input className={fieldClass} name="origin" required /></label>
              <label className={labelClass}>Destino ou passeio *<input className={fieldClass} name="destination" required /></label>
              <label className={`${labelClass} col-span-2 max-[700px]:col-span-1`}>Observações<textarea className={`${fieldClass} min-h-28 resize-y`} name="notes" placeholder="Bagagens, crianças, acessibilidade ou outras informações importantes." /></label>
              <div className="col-span-2 max-[700px]:col-span-1"><button className="w-full rounded-full bg-[#25d366] px-6 py-4 font-extrabold text-[#092815] transition hover:-translate-y-0.5 hover:shadow-lg" type="submit">Enviar solicitação de agendamento</button><p className="mt-3 text-center text-xs text-muted">Os dados serão usados pela GLM para preparar seu pré-voucher.</p></div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
