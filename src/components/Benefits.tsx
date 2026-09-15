import { BadgeCheck, Car, MapPinned, MessagesSquare } from "lucide-react";

const items = [
  { icon: Car, title: "Conforto", text: "Deslocamentos pensados para você aproveitar a viagem." },
  { icon: MapPinned, title: "Roteiros selecionados", text: "Experiências nos principais atrativos da região." },
  { icon: MessagesSquare, title: "Atendimento próximo", text: "Converse diretamente pelo WhatsApp antes de reservar." },
  { icon: BadgeCheck, title: "Segurança", text: "Organização e suporte durante toda a experiência." }
];

export function Benefits() {
  return ( 
    <section className="relative z-[4] -mt-[54px] max-[620px]:-mt-7">
      <div className="mx-auto grid w-[min(1120px,calc(100%-40px))] grid-cols-4 overflow-hidden rounded-[22px] bg-white shadow-[0_20px_60px_rgba(25,45,38,.14)] max-[900px]:grid-cols-2 max-[620px]:w-[min(1120px,calc(100%-28px))] max-[620px]:grid-cols-1">
        {items.map(({icon: Icon, title, text}) =>
        <article key={title} className="flex gap-4 border-r border-[#edf0ee] px-6 py-7 last:border-0 max-[620px]:border-b max-[620px]:border-r-0">
          <Icon className="shrink-0 text-green-light" size={28}/>
          <div>
            <h3 className="mb-[7px] text-base font-bold">{title}</h3>
            <p className="text-sm leading-normal text-muted">{text}</p>
          </div>
        </article>)}
      </div>
    </section>
  )
}
