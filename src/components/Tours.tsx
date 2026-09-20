import { MessageCircle } from "lucide-react";
import { tours } from "@/data/tours";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function Tours() {
  return (
    <section className="py-[110px] max-[620px]:py-[78px]" id="passeios">
      <div className="mx-auto w-[min(1120px,calc(100%-40px))] max-[620px]:w-[min(1120px,calc(100%-28px))]">
        <div className="mb-[42px] max-w-[700px]"><span className="text-xs font-extrabold uppercase tracking-[.18em] text-green-light">Explore</span><h2 className="my-3 text-[clamp(2.2rem,4vw,3.7rem)] font-bold leading-[1.05]">Escolha sua próxima experiência</h2><p className="leading-[1.7] text-muted">Escolha entre os circuitos oferecidos pela GLM e fale conosco para consultar detalhes e disponibilidade.</p></div>
        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
          {tours.map((tour) => (
            <article className="overflow-hidden rounded-[22px] border border-[#e2edf0] bg-white shadow-[0_14px_45px_rgba(44,109,144,.09)]" key={tour.id}>
              <img className="block h-[270px] w-full object-cover" src={tour.image} alt={tour.title} />
              <div className="p-6"><div className="flex items-center gap-[7px] text-[.85rem] font-bold text-green-light">Circuito</div><h3 className="my-3 text-[1.45rem] font-bold">{tour.title}</h3><p className="min-h-[78px] leading-relaxed text-muted max-[620px]:min-h-0">{tour.description}</p>
                <a className="mt-2 inline-flex items-center gap-2 font-extrabold text-green-light" href={getWhatsAppLink(`Olá! Tenho interesse no passeio ${tour.title}. Pode me passar mais informações?`)} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Reservar pelo WhatsApp</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
