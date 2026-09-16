import { ArrowRight, MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="relative flex min-h-[760px] items-center overflow-hidden bg-green bg-[url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center text-white max-[900px]:min-h-[680px]" id="inicio">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/video_lençóis.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,29,24,.88)] via-[rgba(8,29,24,.58)] to-[rgba(8,29,24,.30)]" />
      <div className="relative mx-auto w-[min(1120px,calc(100%-40px))] pt-20 max-[620px]:w-[min(1120px,calc(100%-28px))]">
        <span className="text-xs font-extrabold uppercase tracking-[.18em]">Transporte e Turismo em São Luís</span>
        <h1 className="my-[18px] max-w-[850px] text-[clamp(3rem,5vw,5.8rem)] font-bold leading-[.96] max-[620px]:text-[2.6rem]">Conheça o Maranhão com conforto, segurança e experiências inesquecíveis.</h1>
        <p className="max-w-[650px] text-[1.15rem] leading-[1.7] text-[#e7eeeb] max-[620px]:text-base">Passeios, roteiros e transporte turístico com atendimento direto da GLM - Transporte e Turismo.</p>
        <div className="mt-8 flex flex-wrap gap-3 max-[620px]:[&_a]:w-full">
          <a className="inline-flex items-center justify-center gap-[9px] rounded-full bg-white px-5 py-3.5 font-bold text-green transition-transform hover:-translate-y-0.5" href="#passeios">Ver passeios 
            <ArrowRight size={18} />
          </a>
          <a className="inline-flex items-center justify-center gap-[9px] rounded-full border border-white/55 px-5 py-3.5 font-bold text-white backdrop-blur-lg transition-transform hover:-translate-y-0.5" href={getWhatsAppLink("Olá! Quero montar meu roteiro de viagem.")} target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> Montar meu roteiro
          </a>
        </div>
      </div>
    </section>
  );
}
