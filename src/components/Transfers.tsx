import { ArrowRight, MapPin } from "lucide-react";
import { transfers } from "@/data/transfers";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function Transfers() {
  return (
    <section className="bg-[#f3f8fa] py-[110px] max-[620px]:py-[78px]" id="transfers">
      <div className="mx-auto w-[min(1120px,calc(100%-40px))] max-[620px]:w-[min(1120px,calc(100%-28px))]">
        <div className="mb-[42px] max-w-[700px]"><span className="text-xs font-extrabold uppercase tracking-[.18em] text-green-light">Transporte</span><h2 className="my-3 text-[clamp(2.2rem,4vw,3.7rem)] font-bold leading-[1.05]">Traslados para sua viagem</h2><p className="leading-[1.7] text-muted">Conectamos São Luís aos principais destinos da região e também realizamos traslado entre aeroporto e hotel.</p></div>
        <div className="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
          {transfers.map((route) => (
            <a key={route} className="flex items-center gap-4 rounded-[18px] border border-[#d7e7eb] bg-white px-6 py-[22px] shadow-[0_8px_28px_rgba(44,109,144,.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(44,109,144,.1)] max-[620px]:p-[18px]" href={getWhatsAppLink(`Olá! Gostaria de informações e orçamento para o traslado ${route}.`)} target="_blank" rel="noreferrer">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sand text-green-light"><MapPin size={22}/></span><strong className="flex-1 text-[1.05rem]">{route}</strong><ArrowRight size={20}/>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
