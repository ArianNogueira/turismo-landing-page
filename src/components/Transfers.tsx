"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, Clock, ImageIcon, MapPin, MessageCircle, X } from "lucide-react";
import { transferDetails } from "@/data/transfers";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function Transfers() {
  const [selectedTransfer, setSelectedTransfer] = useState<(typeof transferDetails)[number] | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!selectedTransfer) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedTransfer]);

  return (
    <section className="bg-[#f3f8fa] py-[110px] max-[620px]:py-[78px]" id="transfers">
      <div className="mx-auto w-[min(1120px,calc(100%-40px))] max-[620px]:w-[min(1120px,calc(100%-28px))]">
        <div className="mb-[42px] max-w-[700px]"><span className="text-xs font-extrabold uppercase tracking-[.18em] text-green-light">Transporte</span><h2 className="my-3 text-[clamp(2.2rem,4vw,3.7rem)] font-bold leading-[1.05]">Transfer privativo</h2><p className="leading-[1.7] text-muted">Viaje com conforto e tranquilidade entre São Luís, Barreirinhas e Santo Amaro, ou entre o aeroporto e seu hotel. Escolha seu trajeto para ver os detalhes da viagem, datas e horários.</p></div>
        <div className="grid grid-cols-3 gap-4 max-[1000px]:grid-cols-1">
          {transferDetails.map((transfer) => (
            <button type="button" key={transfer.route} aria-haspopup="dialog" onClick={() => setSelectedTransfer(transfer)} className="flex items-center gap-4 rounded-[18px] border border-[#d7e7eb] bg-white px-6 py-[22px] text-left shadow-[0_8px_28px_rgba(44,109,144,.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(44,109,144,.1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-light/30 max-[620px]:p-[18px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sand text-green-light"><MapPin size={22} aria-hidden="true"/></span><span className="flex-1"><strong className="block text-[1.05rem]">{transfer.route}</strong><span className="mt-1 block text-sm text-muted">Ver detalhes da viagem</span></span><ArrowRight size={20} aria-hidden="true"/>
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link className="inline-flex items-center justify-center rounded-full bg-peach px-6 py-3.5 text-center font-bold text-white transition hover:-translate-y-0.5 hover:bg-green-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-light/30" href="/agendamento">Faça seu agendamento</Link>
        </div>
      </div>
      <dialog ref={dialogRef} aria-labelledby="transfer-title" onCancel={() => setSelectedTransfer(null)} onClose={() => setSelectedTransfer(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelectedTransfer(null); }} className="m-auto max-h-[90dvh] w-[min(640px,calc(100%-32px))] overflow-y-auto overscroll-contain rounded-[24px] border-0 bg-white p-0 text-ink shadow-2xl backdrop:bg-[#183f55]/70 backdrop:backdrop-blur-sm">
        {selectedTransfer && (
          <div className="relative">
            <div className="sticky top-0 z-20 h-0">
            <button type="button" autoFocus onClick={() => setSelectedTransfer(null)} aria-label="Fechar detalhes do transfer" className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-green shadow-md transition hover:bg-sand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-light/30"><X size={22} /></button>
            </div>
            {selectedTransfer.image ? (
              <img src={selectedTransfer.image} alt={`Transfer privativo: ${selectedTransfer.route}`} className="h-56 w-full object-cover max-[620px]:h-44" />
            ) : (
              <div className="flex h-56 flex-col items-center justify-center gap-3 bg-gradient-to-br from-sand to-[#d7e7eb] text-green-light max-[620px]:h-44"><ImageIcon size={44} aria-hidden="true" /><span className="text-sm font-bold">Conheça seu próximo trajeto</span></div>
            )}
            <div className="p-8 max-[620px]:p-6">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-green-light">Transfer privativo</p>
              <h3 id="transfer-title" className="mb-4 mt-2 text-2xl font-bold">{selectedTransfer.route}</h3>
              <p className="leading-relaxed text-muted">{selectedTransfer.summary}</p>
              <div className="mt-6">
                <h4 className="font-bold">Sentidos disponíveis</h4>
                <ul className="mt-3 grid gap-2">
                  {selectedTransfer.directions.map((direction) => (
                    <li key={direction} className="flex items-center gap-2 rounded-xl border border-[#d7e7eb] px-4 py-3 text-sm font-semibold text-green"><MapPin size={18} className="shrink-0" aria-hidden="true" />{direction}</li>
                  ))}
                </ul>
              </div>
              <div className="my-6 grid gap-4 rounded-2xl bg-[#f3f8fa] p-5">
                <div className="flex gap-3"><CalendarDays className="shrink-0 text-green-light" size={22} aria-hidden="true" /><div><h4 className="font-bold">Datas</h4><p className="mt-1 text-sm leading-relaxed text-muted">{selectedTransfer.dates}</p></div></div>
                <div className="flex gap-3"><Clock className="shrink-0 text-green-light" size={22} aria-hidden="true" /><div><h4 className="font-bold">Horários</h4><p className="mt-1 text-sm leading-relaxed text-muted">{selectedTransfer.times}</p></div></div>
              </div>
              {/* Descomente junto com price em src/data/transfers.ts quando o valor estiver definido.
              <p className="mb-6 text-2xl font-extrabold text-green">{selectedTransfer.price}</p>
              */}
              <div className="grid grid-cols-2 gap-3 max-[360px]:gap-2">
                <Link href="/agendamento" className="flex min-h-11 items-center justify-center rounded-full bg-peach px-3 py-3 text-center text-sm font-bold text-white transition hover:bg-green-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-light/30">Faça seu agendamento</Link>
                <a href={getWhatsAppLink(`Olá! Gostaria de mais informações sobre o transfer privativo ${selectedTransfer.route}.`)} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-green px-3 max-[360px]:flex-col max-[360px]:gap-1 py-3 text-center text-sm font-bold text-white transition hover:bg-green-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-light/30"><MessageCircle size={18} className="shrink-0" aria-hidden="true" />Falar no WhatsApp</a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
