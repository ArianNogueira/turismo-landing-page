import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function CTA() {
  return (
    <section className="py-20" id="contato">
      <div className="mx-auto flex w-[min(1120px,calc(100%-40px))] items-center justify-between gap-10 rounded-[32px] bg-green p-14 text-white max-[900px]:flex-col max-[900px]:items-start max-[620px]:w-[min(1120px,calc(100%-28px))] max-[620px]:px-6 max-[620px]:py-9">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-[.18em]">Sua viagem começa aqui</span>
          <h2 className="my-3 text-[clamp(2.2rem,4vw,3.7rem)] font-bold leading-[1.05]">Pronto para montar seu roteiro?</h2>
          <p className="max-w-[650px] text-[#d8e5df]">Fale com a GLM pelo WhatsApp e receba atendimento para escolher seu passeio ou transporte.</p>
        </div>
        <a className="inline-flex items-center justify-center gap-[9px] whitespace-nowrap rounded-full bg-white px-5 py-3.5 font-bold text-green transition-transform hover:-translate-y-0.5" href={getWhatsAppLink("Olá! Quero montar meu roteiro e gostaria de mais informações.")} target="_blank" rel="noreferrer">
          <MessageCircle size={19}/> Falar no WhatsApp
        </a>
      </div>
    </section>
  )
}
