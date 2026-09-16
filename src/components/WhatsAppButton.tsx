import Image from "next/image";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppButton() {
  return (
    <a className="fixed bottom-[22px] right-[22px] z-30 block h-[58px] w-[58px] overflow-hidden rounded-full shadow-[0_14px_30px_rgba(0,0,0,.2)] transition-transform hover:-translate-y-1 hover:scale-105" href={getWhatsAppLink("Olá! Vim pelo site e gostaria de mais informações.")} target="_blank" rel="noreferrer" aria-label="Conversar pelo WhatsApp">
      <Image src="/whatsapp.png" alt="" fill sizes="58px" className="object-cover" />
    </a>
  )
}
