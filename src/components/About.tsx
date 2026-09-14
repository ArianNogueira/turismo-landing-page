import { CheckCircle2 } from "lucide-react";

export function About() {
  return (
    <section className="section about" id="sobre">
      <div className="container about-grid">
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80" alt="Paisagem natural" />
        </div>
        <div>
          <span className="eyebrow dark">Sobre nós</span>
          <h2>Mais do que um passeio: uma experiência bem cuidada.</h2>
          <p>Somos uma agência de turismo focada em proporcionar experiências memoráveis, com atendimento direto, roteiros selecionados e suporte para você viajar com tranquilidade.</p>
          <ul className="check-list">
            <li><CheckCircle2/> Atendimento personalizado</li>
            <li><CheckCircle2/> Roteiros para diferentes perfis</li>
            <li><CheckCircle2/> Reserva rápida pelo WhatsApp</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
