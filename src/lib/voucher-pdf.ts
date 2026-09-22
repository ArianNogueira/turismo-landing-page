import { jsPDF } from "jspdf";

export type Voucher = {
  code: string; client: string; phone: string; service: string; date: string;
  time: string; passengers: string; origin: string; destination: string;
  vehicle: string; driver: string; price: string; payment: string; notes: string;
  issuedAt: string; arrivalTime: string;
};

export const standardNotes = "Sujeito à disponibilidade. Para confirmação, envie o comprovante de depósito para o nosso e-mail. Em caso de dúvidas, entre em contato pelo telefone.";
export const formatDate = (date: string) => date ? date.split("-").reverse().join("/") : "—";
export const money = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const priceInCents = (price: string) => Math.round(Number(price.replace(/R\$\s*/g, "").replace(/\./g, "").replace(",", ".")) * 100) || 0;

export async function createVoucherPdf(v: Voucher) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const response = await fetch("/Logo.png");
  if (!response.ok) throw new Error("Não foi possível carregar o logotipo.");
  const logo = new Uint8Array(await response.arrayBuffer());
  pdf.addImage(logo, "PNG", 87, 7, 36, 36);
  pdf.setFont("times", "normal"); pdf.setFontSize(8);
  pdf.text("Endereço: Rua Bacarituba, Casa 08 - Planalto Turu 2 - São Luís / MA", 105, 44, { align: "center" });
  pdf.text("CNPJ: 61.560.370/0001-30 | E-mail: glmtope@gmail.com | Telefone: (98) 9 9105-7467", 105, 48, { align: "center" });
  pdf.setDrawColor(50); pdf.setLineWidth(0.2); pdf.line(14, 50, 196, 50);
  pdf.setFont("times", "bold"); pdf.setFontSize(12);
  pdf.text("VOUCHER DE SERVIÇOS - TRANSFERS E PASSEIOS", 105, 60, { align: "center" });
  let y = 64;
  const box = (x: number, top: number, width: number, height: number, fill = false) => {
    pdf.setDrawColor(215); pdf.setFillColor(243, 243, 243); pdf.setLineWidth(0.15); pdf.rect(x, top, width, height, fill ? "FD" : "S");
  };
  const lines = (text: string, width: number) => pdf.splitTextToSize(text, width) as string[];
  pdf.setFontSize(8); pdf.setFont("times", "normal");
  const client = lines(`CLIENTE: ${v.client || "—"}`, 111);
  const code = lines(`Voucher Nº: ${v.code || "—"}`, 61);
  const customerHeight = Math.max(client.length, code.length) * 3.8 + 8;
  box(14, y, 182, customerHeight, true);
  pdf.text(client, 16, y + 4.5); pdf.text(code, 132, y + 4.5);
  pdf.text(`Qtd. Passageiros: ${v.passengers || "—"} pessoas`, 16, y + customerHeight - 3);
  pdf.text(`Data de Emissão: ${formatDate(v.issuedAt)}`, 132, y + customerHeight - 3);
  y += customerHeight + 2;
  const columns = [14, 47, 141, 168, 196];
  pdf.setFont("times", "bold");
  ["Data", "Rota", "Passageiros", "Valor R$"].forEach((label, i) => {
    box(columns[i], y, columns[i + 1] - columns[i], 7, true); pdf.text(label, columns[i] + 2, y + 4.5);
  });
  y += 7; pdf.setFont("times", "normal");
  // The built-in Times font cannot encode arrows: jsPDF emits UTF-16 bytes
  // that render as extra spacing and overflow despite the measured line width.
  const normalizeRoute = (text: string) => text.normalize("NFC")
    .replace(/(?:[→➜➝➞➔⇒!]|->)+/g, " para ")
    .replace(/\s+/g, " ").trim();
  const itinerary = [v.origin, v.destination].map(normalizeRoute).filter(Boolean).join(" para ");
  const service = normalizeRoute(v.service);
  // Older bookings stored the itinerary in the service field.
  const serviceIsItinerary = service.toLocaleLowerCase("pt-BR") === itinerary.toLocaleLowerCase("pt-BR")
    || service.replace(/\s*\/\s*/g, " para ").toLocaleLowerCase("pt-BR") === itinerary.toLocaleLowerCase("pt-BR");
  const route = [!service || serviceIsItinerary ? "Transfer Privativo" : service, itinerary].filter(Boolean).join(": ");
  pdf.setFontSize(7); pdf.setCharSpace(0);
  const routeLines = lines([`${route}${v.time ? "," : "."}`, v.time && `Saída ${v.time}.`, v.arrivalTime && `Previsão de chegada ${v.arrivalTime}.`, v.vehicle && `Veículo: ${v.vehicle}.`, v.driver && `Motorista: ${v.driver}.`].filter(Boolean).join(" ").replace(/\s+/g, " "), columns[2] - columns[1] - 6);
  const height = Math.max(11, routeLines.length * 3.3 + 5);
  if (y + height > 175) throw new Error("A descrição da rota está muito longa. Resuma para manter o voucher em uma página.");
  for (let i = 0; i < 4; i++) box(columns[i], y, columns[i + 1] - columns[i], height);
  pdf.text(routeLines, 49, y + 4.5, { lineHeightFactor: 1.2, charSpace: 0 });
  pdf.setFontSize(8);
  pdf.text(formatDate(v.date), 16, y + 5);
  pdf.text(v.passengers || "—", 154.5, y + 5, { align: "center" });
  const base = priceInCents(v.price);
  const isCredit = v.payment.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes("credito");
  const surcharge = isCredit ? Math.max(0, Math.trunc(Number(v.passengers) || 0)) * 1000 : 0;
  const total = base + surcharge;
  const deposit = Math.round(base / 2);
  pdf.text(money(total), 194, y + 5, { align: "right" });
  y += height + 2; box(14, y, 182, 7, true); pdf.setFont("times", "bold");
  pdf.text("VALOR TOTAL", 16, y + 4.5); pdf.text(money(total), 194, y + 4.5, { align: "right" }); y += 9;
  const paragraphs = [
    "Forma de Pagamento: Transferência Bancária / Depósito ou Cartão de Crédito (só de 1x).",
    `Pagamento via Depósito / Transferência (Valor Base: ${money(base)}): 50% (${money(deposit)}) no agendamento e 50% (${money(base - deposit)}) ao embarcar.`,
    ...(isCredit ? [`Pagamento via Cartão de Crédito (só de 1x, com acréscimo): acréscimo de R$ 10,00 por passageiro. Total de acréscimo: ${money(surcharge)} (${v.passengers || "0"} passageiros x R$ 10,00). O valor total para pagamento com cartão é de ${money(total)}.`] : []),
    ...(v.payment ? [`Forma de pagamento escolhida: ${v.payment}.`] : []),
    `Observações: ${standardNotes}`,
    ...(v.notes.trim() ? [`Observações da reserva: ${v.notes.trim()}`] : []),
  ];
  pdf.setFont("times", "normal"); pdf.setFontSize(7.5);
  const paymentLines = paragraphs.map(p => lines(p, 176));
  const paymentHeight = 10 + paymentLines.reduce((sum, p) => sum + p.length * 3.2 + 1, 0);
  if (y + paymentHeight > 251) throw new Error("As observações estão muito longas. Resuma para manter o voucher em uma página.");
  box(14, y, 182, paymentHeight); pdf.setFont("times", "bold"); pdf.setFontSize(9);
  pdf.text("CONDIÇÕES DE PAGAMENTO", 16, y + 5); y += 9;
  pdf.setFont("times", "normal"); pdf.setFontSize(7.5);
  for (const paragraph of paymentLines) { pdf.text(paragraph, 16, y); y += paragraph.length * 3.2 + 1; }
  y += 8; pdf.setFontSize(20); pdf.text("Gilso Lopes", 105, y, { align: "center" });
  pdf.setDrawColor(0); pdf.line(88, y + 0.8, 122, y + 0.8);
  pdf.setFontSize(8); pdf.text("G. Lopes", 105, y + 4, { align: "center" });
  pdf.setFontSize(7); pdf.text(lines(`Observações: ${standardNotes}`, 180), 15, y + 8);
  pdf.text(`GLM Transporte e Turismo - Voucher ${v.code || "—"}`, 16, 282);
  pdf.text("Página 1 de 1", 194, 282, { align: "right" });
  return pdf;
}
