import { BadgeCheck, Car, MapPinned, MessagesSquare } from "lucide-react";

const items = [
  { icon: Car, title: "Conforto", text: "Deslocamentos pensados para você aproveitar a viagem." },
  { icon: MapPinned, title: "Roteiros selecionados", text: "Experiências nos principais atrativos da região." },
  { icon: MessagesSquare, title: "Atendimento próximo", text: "Converse diretamente pelo WhatsApp antes de reservar." },
  { icon: BadgeCheck, title: "Segurança", text: "Organização e suporte durante toda a experiência." }
];

export function Benefits() {
  return ( 
    <section className="benefits">
      <div className="container benefits-grid">{items.map(({icon: Icon, title, text}) => 
        <article key={title} className="benefit-card">
          <Icon size={28}/>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </article>
        )}
      </div>
    </section>
  )
}
