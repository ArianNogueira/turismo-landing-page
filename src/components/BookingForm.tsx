"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { saveBooking } from "@/lib/booking-storage";

const fieldClass = "mt-2 w-full rounded-xl border border-[#dce4e0] bg-white px-4 py-3 text-ink outline-none transition placeholder:text-[#9aa7a2] focus:border-green-light focus:ring-4 focus:ring-green-light/10";
const labelClass = "text-sm font-bold text-ink";

export function BookingForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) || "");
    saveBooking({
      id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "pending",
      name: value("name"), phone: value("phone"), email: value("email"), service: value("service"),
      date: value("date"), time: value("time"), passengers: value("passengers"),
      origin: value("origin"), destination: value("destination"), reference: value("reference"), notes: value("notes"),
    });
    form.reset();
    setSent(true);
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
              <label className={labelClass}>WhatsApp *<input className={fieldClass} name="phone" type="tel" required placeholder="(98) 99999-9999" /></label>
              <label className={labelClass}>E-mail<input className={fieldClass} name="email" type="email" /></label>
              <label className={labelClass}>Serviço desejado *<select className={fieldClass} name="service" required defaultValue=""><option value="" disabled>Selecione</option><option>Passeio turístico</option><option>Traslado</option><option>Transporte privativo</option><option>Roteiro personalizado</option></select></label>
              <label className={labelClass}>Data da viagem *<input className={fieldClass} name="date" type="date" required /></label>
              <label className={labelClass}>Horário desejado<input className={fieldClass} name="time" type="time" /></label>
              <label className={labelClass}>Número de passageiros *<input className={fieldClass} name="passengers" type="number" min="1" required /></label>
              <label className={labelClass}>Hospedagem ou número do voo<input className={fieldClass} name="reference" /></label>
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
