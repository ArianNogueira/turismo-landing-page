"use client";

import { Menu, MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function Navbar() {
  return (
    <header className="absolute top-0 z-20 w-full text-white">
      <div className="mx-auto flex h-[88px] w-[min(1120px,calc(100%-40px))] items-center gap-7 max-[620px]:w-[min(1120px,calc(100%-28px))]">
        <a className="mr-auto text-xl font-extrabold" href="#inicio">GLM Turismo</a>
        <nav className="flex gap-[26px] text-[.95rem] [&_a]:opacity-90 hover:[&_a]:opacity-100 max-[900px]:hidden" aria-label="Navegação principal">
          <a href="#inicio">Início</a>
          <a href="#passeios">Passeios</a>
          <a href="#transfers">Traslados</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
        <a className="inline-flex items-center justify-center gap-[9px] rounded-full bg-[#25d366] px-5 py-3.5 font-bold text-[#092815] transition-transform hover:-translate-y-0.5 max-[900px]:hidden" href={getWhatsAppLink("Olá! Gostaria de conhecer os passeios disponíveis.")} target="_blank" rel="noreferrer">
          <MessageCircle size={18} /> WhatsApp
        </a>
        <button className="hidden border-0 bg-transparent text-white max-[900px]:block" aria-label="Abrir menu">
          <Menu />
        </button>
      </div>
    </header>
  );
}
