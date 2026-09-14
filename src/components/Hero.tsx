import { ArrowRight, MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <span className="eyebrow">Experiências no Maranhão</span>
        <h1>Viva paisagens que você vai lembrar para sempre.</h1>
        <p>Roteiros selecionados, atendimento próximo e experiências pensadas para você aproveitar cada momento da viagem.</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#passeios">Ver passeios <ArrowRight size={18} /></a>
          <a className="btn btn-outline" href={getWhatsAppLink("Olá! Quero montar meu roteiro de viagem.")} target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> Montar meu roteiro
          </a>
        </div>
      </div>
    </section>
  );
}
