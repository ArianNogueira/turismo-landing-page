import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-20" id="contato">
      <div className="mx-auto flex w-[min(1120px,calc(100%-40px))] items-center justify-between gap-10 rounded-[32px] bg-green p-14 text-white shadow-[0_24px_60px_rgba(44,109,144,.24)] max-[900px]:flex-col max-[900px]:items-start max-[620px]:w-[min(1120px,calc(100%-28px))] max-[620px]:px-6 max-[620px]:py-9">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-[.18em]">Sua viagem começa aqui</span>
          <h2 className="my-3 text-[clamp(2.2rem,4vw,3.7rem)] font-bold leading-[1.05]">Pronto para montar seu roteiro?</h2>
          <p className="max-w-[650px] text-[#dceef2]">Fale com a GLM pelo WhatsApp e receba atendimento para escolher seu passeio ou transporte.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-peach px-5 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-green-light" href="/agendamento">Solicitar agendamento</Link>
          <a className="inline-flex items-center justify-center gap-[9px] whitespace-nowrap rounded-full border border-white/40 px-5 py-3.5 font-bold text-white transition-transform hover:-translate-y-0.5" href={getWhatsAppLink("Olá! Quero montar meu roteiro e gostaria de mais informações.")} target="_blank" rel="noreferrer">
            <MessageCircle size={19}/> WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
