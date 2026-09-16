import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Agendamento | GLM Transporte e Turismo",
  description: "Solicite seu passeio ou traslado com a GLM Transporte e Turismo.",
};

export default function BookingPage() {
  return <BookingForm />;
}
