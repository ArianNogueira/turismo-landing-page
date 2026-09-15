import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppButton() {
  return (
    <a className="fixed bottom-[22px] right-[22px] z-30 grid h-[58px] w-[58px] place-items-center rounded-full bg-[#25d366] text-white shadow-[0_14px_30px_rgba(0,0,0,.2)]" href={getWhatsAppLink("Olá! Vim pelo site e gostaria de mais informações.")} target="_blank" rel="noreferrer" aria-label="Conversar pelo WhatsApp">
      <MessageCircle size={27}/>
    </a>
  )
}
