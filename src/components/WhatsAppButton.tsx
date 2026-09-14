import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppButton() {
  return (
    <a className="floating-whatsapp" href={getWhatsAppLink("Olá! Vim pelo site e gostaria de mais informações.")} target="_blank" rel="noreferrer" aria-label="Conversar pelo WhatsApp">
      <MessageCircle size={27}/>
    </a>
  )
}
