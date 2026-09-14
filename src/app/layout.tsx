import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sua Turismo | Experiências no Maranhão",
  description: "Passeios, roteiros e experiências turísticas com reserva rápida pelo WhatsApp."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
