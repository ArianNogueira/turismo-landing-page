import { CheckCircle2 } from "lucide-react";

export function About() {
  return (
    <section className="bg-sand py-[110px] max-[620px]:py-[78px]" id="sobre">
      <div className="mx-auto grid w-[min(1120px,calc(100%-40px))] grid-cols-2 items-center gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-9 max-[620px]:w-[min(1120px,calc(100%-28px))]">
        <div className="h-[520px] w-full overflow-hidden rounded-[32px] shadow-[0_20px_50px_rgba(44,109,144,.14)] max-[620px]:h-[390px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1675.9142805938855!2d-44.21730130035448!3d-2.500830866450685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7f693a9e57caab3%3A0xd77ce15aae48b6d6!2sglm%20transfer%20e%20turismo!5e0!3m2!1spt-BR!2sbr!4v1790715130829!5m2!1spt-BR!2sbr"
            title="Localização da GLM Transfer e Turismo"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="block h-full w-full border-0"
          />
        </div>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-[.18em] text-green-light">Sobre nós</span>
          <h2 className="my-3 text-[clamp(2.2rem,4vw,3.7rem)] font-bold leading-[1.05]">Mais do que um passeio: uma experiência bem cuidada.</h2>
          <p className="leading-[1.7] text-muted">
            A GLM - Transfer e Turismo oferece transporte turístico, passeios e roteiros com atendimento próximo para quem deseja conhecer São Luís e os encantos do Maranhão com tranquilidade.
          </p>
          <ul className="mt-7 grid list-none gap-3.5 p-0">
            <li className="flex items-center gap-2.5 font-bold"><CheckCircle2 className="text-green-light"/> Atendimento personalizado</li>
            <li className="flex items-center gap-2.5 font-bold"><CheckCircle2 className="text-green-light"/> Roteiros para diferentes perfis</li>
            <li className="flex items-center gap-2.5 font-bold"><CheckCircle2 className="text-green-light"/> Reserva rápida pelo WhatsApp</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
