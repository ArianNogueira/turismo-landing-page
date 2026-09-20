import { Instagram, MapPin, MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-[#183f55] py-[42px] text-[#e2f0f3]">
      <div className="mx-auto flex w-[min(1120px,calc(100%-40px))] items-center justify-between gap-[30px] max-[900px]:flex-wrap max-[900px]:items-start max-[620px]:w-[min(1120px,calc(100%-28px))] max-[620px]:flex-col">
        <div>
          <strong>GLM - Transporte e Turismo</strong>
          <p className="text-sm text-[#8fc1cf]">Conheça São Luís e o Maranhão com conforto e tranquilidade.</p>
        </div>
        <div className="grid gap-2.5 text-sm [&>*]:flex [&>*]:items-center [&>*]:gap-2 [&>*]:text-[#e2f0f3] [&_a]:transition-colors hover:[&_a]:text-peach">
          <a href={getWhatsAppLink("Olá! Gostaria de informações sobre os serviços da GLM - Transporte e Turismo.")} target="_blank" rel="noreferrer"><MessageCircle size={17}/> (98) 9 9105-7467</a>
          <a href="https://www.instagram.com/glmturismo01/" target="_blank" rel="noreferrer"><Instagram size={17}/> @glmturismo01</a>
          <span><MapPin size={17}/> Rua Bacurituba, 01 - Turu, São Luís - MA</span>
        </div>
        <p className="text-sm text-[#8fc1cf]">© 2026 GLM - Transporte e Turismo.</p>
      </div>
    </footer>
  )
}
