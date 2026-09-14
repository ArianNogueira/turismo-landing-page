import { Clock, MessageCircle } from "lucide-react";
import { tours } from "@/data/tours";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function Tours() {
  return (
    <section className="section" id="passeios">
      <div className="container">
        <div className="section-heading"><span className="eyebrow dark">Explore</span><h2>Escolha sua próxima experiência</h2><p>Conheça alguns dos passeios que podem fazer parte do seu roteiro.</p></div>
        <div className="tour-grid">
          {tours.map((tour) => (
            <article className="tour-card" key={tour.id}>
              <img src={tour.image} alt={tour.title} />
              <div className="tour-body"><div className="tour-duration"><Clock size={16}/>{tour.duration}</div><h3>{tour.title}</h3><p>{tour.description}</p>
                <a className="tour-link" href={getWhatsAppLink(`Olá! Tenho interesse no passeio ${tour.title}. Pode me passar mais informações?`)} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Reservar pelo WhatsApp</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
