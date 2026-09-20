"use client";

import Link from "next/link";
import { ArrowLeft, Download, Eye, FolderOpen, TicketCheck, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { BookingRequest, getBookings } from "@/lib/booking-storage";

type Voucher = { code: string; client: string; phone: string; service: string; date: string; time: string; passengers: string; origin: string; destination: string; vehicle: string; driver: string; price: string; payment: string; notes: string };
type SavedVoucher = Voucher & { savedAt: string };
const VOUCHERS_STORAGE_KEY = "glm-saved-vouchers";
const emptyVoucher: Voucher = { code: "", client: "", phone: "", service: "", date: "", time: "", passengers: "", origin: "", destination: "", vehicle: "", driver: "", price: "", payment: "", notes: "" };
const fieldClass = "mt-1.5 w-full rounded-xl border border-[#c9dde3] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-green-light focus:ring-4 focus:ring-green-light/10";

function fromBooking(booking: BookingRequest): Voucher {
  return { ...emptyVoucher, code: booking.code, client: booking.name, phone: booking.phone, service: booking.service, date: booking.date, time: booking.time, passengers: booking.passengers, origin: booking.origin, destination: booking.destination, notes: booking.notes };
}

function formatDate(date: string) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return day && month && year ? `${day}/${month}/${year}` : date;
}

function formatPrice(price: string) {
  return price ? `R$ ${price.replace(/^R\$\s*/, "")}` : "";
}

function formatCurrencyInput(event: FormEvent<HTMLInputElement>) {
  const digits = event.currentTarget.value.replace(/\D/g, "");
  event.currentTarget.value = digits
    ? (Number(digits) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "";
}

function voucherText(v: Voucher) {
  return ["GLM TRANSPORTE E TURISMO", "VOUCHER DE SERVIÇO", `Código: ${v.code || "—"}`, "", `Cliente: ${v.client || "—"}`, `Contato: ${v.phone || "—"}`, `Data: ${formatDate(v.date) || "—"}`, `Horário: ${v.time || "—"}`, `Passageiros: ${v.passengers || "—"}`, `Origem: ${v.origin || "—"}`, `Destino: ${v.destination || "—"}`, `Veículo: ${v.vehicle || "—"}`, `Motorista: ${v.driver || "—"}`, `Valor: ${formatPrice(v.price) || "—"}`, `Pagamento: ${v.payment || "—"}`, `Observações: ${v.notes || "—"}`].join("\n");
}

export function VoucherGenerator() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [voucher, setVoucher] = useState<Voucher>(emptyVoucher);
  const [formKey, setFormKey] = useState("empty");
  const [savedVouchers, setSavedVouchers] = useState<SavedVoucher[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFilter, setModalFilter] = useState("");

  const filteredSavedVouchers = savedVouchers.filter((item) => {
    const search = modalFilter.trim().toLocaleLowerCase("pt-BR");
    return item.client.toLocaleLowerCase("pt-BR").includes(search) || item.code.toLocaleLowerCase("pt-BR").includes(search);
  });

  useEffect(() => {
    setBookings(getBookings());
    try { setSavedVouchers(JSON.parse(localStorage.getItem(VOUCHERS_STORAGE_KEY) || "[]")); }
    catch { setSavedVouchers([]); }
  }, []);

  function selectBooking(id: string) {
    const booking = bookings.find((item) => item.id === id);
    const next = booking ? fromBooking(booking) : emptyVoucher;
    setVoucher(next); setFormKey(id || "empty");
  }

  function update(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    setVoucher(Object.fromEntries(Object.keys(emptyVoucher).map((key) => [key, String(data.get(key) || "")])) as Voucher);
  }

  function saveVoucher(voucherToSave: Voucher) {
    const savedAt = new Date().toISOString();
    const next = [{ ...voucherToSave, savedAt }, ...savedVouchers.filter((item) => item.code !== voucherToSave.code)];
    setSavedVouchers(next);
    localStorage.setItem(VOUCHERS_STORAGE_KEY, JSON.stringify(next));
  }

  async function generatePdf(voucherToGenerate: Voucher, persist = true) {
    if (persist) saveVoucher(voucherToGenerate);
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.setFillColor(44, 109, 144); pdf.rect(0, 0, 210, 42, "F");
    pdf.setTextColor(255, 255, 255); pdf.setFontSize(19); pdf.setFont("helvetica", "bold"); pdf.text("GLM TRANSPORTE E TURISMO", 18, 20);
    pdf.setFontSize(10); pdf.setFont("helvetica", "normal"); pdf.text("VOUCHER DE SERVICO", 18, 29);
    pdf.setTextColor(24, 56, 74); pdf.setFontSize(10);
    const rows = [["CLIENTE", voucherToGenerate.client], ["CONTATO", voucherToGenerate.phone], ["CODIGO", voucherToGenerate.code], ["DATA E HORARIO", [formatDate(voucherToGenerate.date), voucherToGenerate.time].filter(Boolean).join(" as ")], ["PASSAGEIROS", voucherToGenerate.passengers], ["ORIGEM", voucherToGenerate.origin], ["DESTINO", voucherToGenerate.destination], ["VEICULO", voucherToGenerate.vehicle], ["MOTORISTA", voucherToGenerate.driver], ["VALOR", formatPrice(voucherToGenerate.price)], ["PAGAMENTO", voucherToGenerate.payment], ["OBSERVACOES", voucherToGenerate.notes]];
    let y = 57;
    for (const [label, value] of rows) { pdf.setFont("helvetica", "bold"); pdf.setTextColor(216, 101, 59); pdf.text(label, 18, y); pdf.setFont("helvetica", "normal"); pdf.setTextColor(24, 56, 74); const lines = pdf.splitTextToSize(value || "-", 115); pdf.text(lines, 70, y); y += Math.max(11, lines.length * 5 + 4); }
    pdf.setDrawColor(143, 193, 207); pdf.line(18, 277, 192, 277); pdf.setFontSize(9); pdf.setTextColor(96, 121, 135); pdf.text("GLM Transporte e Turismo  |  (98) 9 9105-7467  |  @glmturismo01", 105, 285, { align: "center" });
    pdf.save(`voucher-${voucherToGenerate.code || "gml"}.pdf`);
  }

  function viewSavedVoucher(savedVoucher: SavedVoucher) {
    const { savedAt: _savedAt, ...voucherData } = savedVoucher;
    setVoucher(voucherData);
    setFormKey(`${savedVoucher.code}-${savedVoucher.savedAt}`);
    setModalOpen(false);
  }

  return (
    <main className="min-h-screen bg-[#e8f2f5] py-8">
      <div className="mx-auto w-[min(1280px,calc(100%-40px))] max-[620px]:w-[min(1280px,calc(100%-28px))]">
        <div className="mb-6 flex items-center justify-between gap-4"><Link href="/" className="inline-flex items-center gap-2 font-bold text-green-light"><ArrowLeft size={18} /> Voltar</Link><span className="rounded-full bg-[#fbe9dc] px-4 py-2 text-xs font-bold text-[#94401f]">Área operacional — acesso restrito</span></div>
        <div className="grid grid-cols-[420px_1fr] gap-7 max-[1000px]:grid-cols-1">
          <section className="rounded-[22px] bg-white p-6 shadow-sm">
            <div className="mb-6"><span className="text-xs font-extrabold uppercase tracking-[.18em] text-green-light">Gerador</span><h1 className="mt-2 text-3xl font-bold">Preparar voucher</h1><p className="mt-2 text-sm leading-relaxed text-muted">Selecione uma solicitação e complete valor e dados operacionais.</p></div>
            <label className="mb-5 block text-sm font-bold">Solicitação pendente<select className={fieldClass} onChange={(e) => selectBooking(e.target.value)} defaultValue=""><option value="">Preenchimento manual</option>{bookings.map((b) => <option key={b.id} value={b.id}>{b.code} — {b.name} — {b.date}</option>)}</select></label>
            {bookings.length === 0 && <p className="mb-5 rounded-xl bg-sand p-3 text-xs leading-relaxed text-muted">Nenhuma solicitação encontrada neste navegador.</p>}
            <form key={formKey} onInput={update} className="grid grid-cols-2 gap-4">
              <Field name="code" label="Código" value={voucher.code} /><Field name="date" label="Data" type="date" value={voucher.date} />
              <Field name="client" label="Cliente" value={voucher.client} wide /><Field name="phone" label="Contato" value={voucher.phone} /><Field name="passengers" label="Passageiros" type="number" value={voucher.passengers} />
              <Field name="time" label="Horário" type="time" value={voucher.time} />
              <label className="text-sm font-bold">Valor<div className="relative"><span className="pointer-events-none absolute left-3.5 top-1/2 mt-[3px] -translate-y-1/2 text-sm font-semibold text-muted">R$</span><input className={`${fieldClass} pl-10`} name="price" inputMode="numeric" placeholder="0,00" defaultValue={voucher.price.replace(/^R\$\s*/, "")} onInput={formatCurrencyInput} /></div></label>
              <input type="hidden" name="service" value={voucher.service} />
              <Field name="origin" label="Origem" value={voucher.origin} wide /><Field name="destination" label="Destino" value={voucher.destination} wide />
              <Field name="vehicle" label="Veículo" value={voucher.vehicle} /><Field name="driver" label="Motorista" value={voucher.driver} />
              <label className="col-span-2 text-sm font-bold">Forma de pagamento<select className={fieldClass} name="payment" defaultValue={voucher.payment}><option value="">Selecione</option><option value="Débito">Débito</option><option value="Crédito">Crédito</option><option value="Pix">Pix</option><option value="Dinheiro">Dinheiro</option></select></label>
              <label className="col-span-2 text-sm font-bold">Observações<textarea name="notes" defaultValue={voucher.notes} className={`${fieldClass} min-h-24 resize-y`} /></label>
            </form>
          </section>
          <section>
            <div className="mb-4 flex flex-wrap justify-end gap-3"><button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-[#c9dde3] bg-white px-5 py-3 font-bold text-green"><FolderOpen size={18} /> Ver vouchers</button><button onClick={() => generatePdf(voucher)} className="inline-flex items-center gap-2 rounded-full bg-green px-5 py-3 font-bold text-white"><Download size={18} /> Gerar voucher em PDF</button></div>
            <article className="mx-auto min-h-[720px] max-w-[760px] overflow-hidden bg-white shadow-[0_20px_60px_rgba(44,109,144,.12)]">
              <header className="flex items-center justify-between gap-6 bg-green px-10 py-8 text-white max-[620px]:px-6"><div><strong className="text-xl">GLM Transporte e Turismo</strong><p className="mt-1 text-sm text-[#cce5eb]">Voucher de serviço</p></div><TicketCheck size={46} className="text-[#db905a]" /></header>
              <div className="p-10 max-[620px]:p-6"><div className="mb-8 flex items-start justify-between gap-6 border-b border-[#d7e7eb] pb-7"><div><span className="text-xs font-bold uppercase tracking-widest text-muted">Cliente</span><h2 className="mt-2 text-2xl font-bold text-green">{voucher.client || "Nome do cliente"}</h2><p className="mt-1 text-sm text-muted">{voucher.phone || "Contato do cliente"}</p></div><div className="text-right"><span className="text-xs font-bold uppercase tracking-widest text-muted">Código</span><p className="mt-2 font-extrabold text-green-light">{voucher.code || "GLM-0000"}</p></div></div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-7 max-[620px]:grid-cols-1"><Info label="Data e horário" value={[formatDate(voucher.date), voucher.time].filter(Boolean).join(" às ")} /><Info label="Passageiros" value={voucher.passengers} /><Info label="Origem" value={voucher.origin} /><Info label="Destino" value={voucher.destination} /><Info label="Veículo" value={voucher.vehicle} /><Info label="Motorista" value={voucher.driver} /><Info label="Valor" value={formatPrice(voucher.price)} /><Info label="Pagamento" value={voucher.payment} /></div>
                <div className="mt-9 rounded-2xl bg-sand p-5"><span className="text-xs font-bold uppercase tracking-widest text-muted">Observações</span><p className="mt-2 whitespace-pre-wrap leading-relaxed text-ink">{voucher.notes || "Nenhuma observação informada."}</p></div><footer className="mt-10 border-t border-[#d7e7eb] pt-6 text-center text-sm text-muted">GLM Transporte e Turismo • (98) 9 9105-7467 • @glmturismo01</footer>
              </div>
            </article>
          </section>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#153d52]/70 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="saved-vouchers-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <section className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-[24px] bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-[#d7e7eb] px-6 py-5"><div><span className="text-xs font-extrabold uppercase tracking-[.18em] text-green-light">Histórico</span><h2 id="saved-vouchers-title" className="mt-1 text-2xl font-bold">Vouchers salvos</h2></div><button onClick={() => setModalOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-[#e8f2f5] text-muted hover:text-ink" aria-label="Fechar"><X size={20} /></button></header>
            <div className="p-6">
              <input value={modalFilter} onChange={(event) => setModalFilter(event.target.value)} className="mb-5 w-full rounded-full border border-[#c9dde3] bg-[#f3f8fa] px-5 py-3 text-sm outline-none focus:border-green-light" placeholder="Filtrar por nome ou código" aria-label="Filtrar vouchers por nome ou código" />
              <div className="max-h-[52vh] space-y-3 overflow-y-auto pr-1">
                {filteredSavedVouchers.map((item) => (
                  <article key={`${item.code}-${item.savedAt}`} className="flex items-center gap-4 rounded-2xl border border-[#d7e7eb] p-4">
                    <div className="min-w-0 flex-1"><strong className="block truncate text-ink">{item.client || "Cliente sem nome"}</strong><span className="mt-1 block text-sm text-muted">{item.code || "Sem código"} • {formatDate(item.date)}</span></div>
                    <button onClick={() => viewSavedVoucher(item)} className="grid h-10 w-10 place-items-center rounded-full border border-[#c9dde3] text-green hover:border-green-light" title="Visualizar voucher" aria-label={`Visualizar voucher ${item.code}`}><Eye size={18} /></button>
                    <button onClick={() => generatePdf(item, false)} className="grid h-10 w-10 place-items-center rounded-full bg-green text-white hover:bg-green-light" title="Baixar voucher" aria-label={`Baixar voucher ${item.code}`}><Download size={18} /></button>
                  </article>
                ))}
                {filteredSavedVouchers.length === 0 && <p className="rounded-2xl bg-sand p-6 text-center text-sm text-muted">Nenhum voucher salvo encontrado.</p>}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function Field({ name, label, type = "text", placeholder, value, wide = false }: { name: string; label: string; type?: string; placeholder?: string; value: string; wide?: boolean }) { return <label className={`text-sm font-bold ${wide ? "col-span-2" : ""}`}>{label}<input className={fieldClass} name={name} type={type} placeholder={placeholder} defaultValue={value} /></label>; }
function Info({ label, value }: { label: string; value: string }) { return <div><span className="text-xs font-bold uppercase tracking-widest text-muted">{label}</span><p className="mt-2 font-semibold text-ink">{value || "—"}</p></div>; }
