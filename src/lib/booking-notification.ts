import type { NewBooking } from "@/lib/booking-storage";

// Loaded from .env; NEXT_PUBLIC values are visible in the browser bundle.
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export async function notifyBooking(booking: NewBooking): Promise<boolean> {
  if (!accessKey?.trim()) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        access_key: accessKey,
        subject: "Nova solicitação de agendamento — GLM Turismo",
        from_name: "GLM Transporte e Turismo",
        name: booking.name,
        ...(booking.email ? { email: booking.email } : {}),
        Telefone: booking.phone,
        Serviço: booking.service,
        Data: booking.date.split("-").reverse().join("/"),
        Horário: booking.time || "Não informado",
        Passageiros: booking.passengers,
        Origem: booking.origin,
        Destino: booking.destination,
        Referência: booking.reference || "Não informada",
        Observações: booking.notes || "Nenhuma",
        Situação: "Pedido registrado. Aguardando confirmação de disponibilidade e valores.",
      }),
    });
    const result = await response.json();
    return response.ok && result?.success === true;
  } catch {
    // Notification failure must never turn a saved booking into a failed request.
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
