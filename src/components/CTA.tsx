import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function CTA() {
  return ( 
  <section className="cta-section" id="contato">
      <div className="container cta-box"><div>
        <span className="eyebrow">Sua viagem começa aqui</span>
        <h2>Pronto para montar seu roteiro?</h2>
        <p>Fale diretamente com nossa equipe e receba ajuda para escolher a melhor experiência.</p>
      </div>
        <a className="btn btn-light" href={getWhatsAppLink("Olá! Quero montar meu roteiro e gostaria de mais informações.")} target="_blank" rel="noreferrer">
          <MessageCircle size={19}/> Falar no WhatsApp
        </a>
      </div>
    </section>
  )
}
