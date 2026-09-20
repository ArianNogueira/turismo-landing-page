import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GLM - Transporte e Turismo | São Luís - MA",
  description: "Transporte turístico, passeios e roteiros em São Luís e no Maranhão. Atendimento rápido pelo WhatsApp.",
  icons: {
    icon: "/Favicon.png",
    shortcut: "/Favicon.png",
    apple: "/Favicon.png",
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-white font-sans text-ink">{children}</body>
    </html>
  )
}
