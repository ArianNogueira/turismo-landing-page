"use client";

import { Menu, MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a className="brand" href="#inicio">Sua Turismo</a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#inicio">Início</a>
          <a href="#passeios">Passeios</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
        <a className="btn btn-whatsapp desktop-cta" href={getWhatsAppLink("Olá! Gostaria de conhecer os passeios disponíveis.")} target="_blank" rel="noreferrer">
          <MessageCircle size={18} /> WhatsApp
        </a>
        <button className="menu-btn" aria-label="Abrir menu"><Menu /></button>
      </div>
    </header>
  );
}
