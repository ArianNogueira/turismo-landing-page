"use client";

import Link from "next/link";
import { ArrowLeft, Download, Eye, FolderOpen, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { BookingRequest, getBookings } from "@/lib/booking-storage";

import { createVoucherPdf, Voucher } from "@/lib/voucher-pdf";
import { getVouchers, saveVoucher, type SavedVoucher } from "@/lib/voucher-storage";
const emptyVoucher: Voucher = { code: "", client: "", phone: "", service: "Transfer Privativo", date: "", time: "", passengers: "", origin: "", destination: "", vehicle: "", driver: "", price: "", payment: "", notes: "", issuedAt: "", arrivalTime: "" };
const fieldClass = "mt-1.5 w-full rounded-xl border border-[#c9dde3] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-green-light focus:ring-4 focus:ring-green-light/10";

function fromBooking(booking: BookingRequest): Voucher {
  return { ...emptyVoucher, code: booking.code, client: booking.name, phone: booking.phone, service: "Transfer Privativo", date: booking.date, time: booking.time, passengers: booking.passengers, origin: booking.origin, destination: booking.destination, notes: booking.notes };
}

function formatDate(date: string) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return day && month && year ? `${day}/${month}/${year}` : date;
}


function formatCurrencyInput(event: FormEvent<HTMLInputElement>) {
  const digits = event.currentTarget.value.replace(/\D/g, "");
  event.currentTarget.value = digits
    ? (Number(digits) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "";
}


export function VoucherGenerator() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [voucher, setVoucher] = useState<Voucher>(emptyVoucher);
  const [formKey, setFormKey] = useState("empty");
  const [savedVouchers, setSavedVouchers] = useState<SavedVoucher[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFilter, setModalFilter] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let url = "";
    const timer = setTimeout(async () => {
      try {
        const pdf = await createVoucherPdf(voucher);
        if (cancelled) return;
        url = URL.createObjectURL(pdf.output("blob"));
        setPreviewUrl(url); setError("");
      } catch (cause) {
        if (!cancelled) { setPreviewUrl(""); setError(cause instanceof Error ? cause.message : "Não foi possível preparar o voucher."); }
      }
    }, 350);
    return () => { cancelled = true; clearTimeout(timer); if (url) URL.revokeObjectURL(url); };
  }, [voucher]);

  const filteredSavedVouchers = savedVouchers.filter((item) => {
    const search = modalFilter.trim().toLocaleLowerCase("pt-BR");
    return item.client.toLocaleLowerCase("pt-BR").includes(search) || item.code.toLocaleLowerCase("pt-BR").includes(search);
  });

  useEffect(() => {
    let cancelled = false;
    setVoucher(current => ({ ...current, issuedAt: new Date().toLocaleDateString("sv-SE") }));
    Promise.all([getBookings(), getVouchers()]).then(([requests, saved]) => {
      if (!cancelled) { setBookings(requests); setSavedVouchers(saved); }
    }).catch(cause => {
      if (!cancelled) setDataError(cause instanceof Error ? cause.message : "Não foi possível carregar os dados.");
    }).finally(() => { if (!cancelled) setLoadingData(false); });
    return () => { cancelled = true; };
  }, []);

  async function refreshData() {
    setLoadingData(true); setDataError("");
    try {
      const [requests, saved] = await Promise.all([getBookings(), getVouchers()]);
      setBookings(requests); setSavedVouchers(saved);
    } catch (cause) { setDataError(cause instanceof Error ? cause.message : "Não foi possível carregar os dados."); }
    finally { setLoadingData(false); }
  }

  function selectBooking(id: string) {
    const booking = bookings.find((item) => item.id === id);
    const next = booking ? fromBooking(booking) : emptyVoucher;
    setBookingId(booking?.id || null);
    setVoucher({ ...next, issuedAt: new Date().toLocaleDateString("sv-SE") }); setFormKey(id || "empty");
  }

  function update(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    setVoucher(Object.fromEntries(Object.keys(emptyVoucher).map((key) => [key, String(data.get(key) || "")])) as Voucher);
  }

  async function generatePdf(voucherToGenerate: Voucher, persist = true) {
    if (generating) return;
    const required = [voucherToGenerate.client, voucherToGenerate.code, voucherToGenerate.date, voucherToGenerate.issuedAt, voucherToGenerate.price];
    if (required.some(value => !value.trim()) || !Number.isInteger(Number(voucherToGenerate.passengers)) || Number(voucherToGenerate.passengers) < 1 || !(voucherToGenerate.origin.trim() && voucherToGenerate.destination.trim())) {
      setError("Preencha responsável, código, emissão, data, passageiros, valor, origem e destino."); return;
    }
    setGenerating(true); setError("");
    try {
      const pdf = await createVoucherPdf(voucherToGenerate);
      if (persist) {
        const saved = await saveVoucher(voucherToGenerate, bookingId);
        setSavedVouchers(current => [saved, ...current.filter(item => item.code !== saved.code)]);
      }
      pdf.save(`voucher-${voucherToGenerate.code.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível gerar ou salvar o voucher."); }
    finally { setGenerating(false); }
  }

  function viewSavedVoucher(savedVoucher: SavedVoucher) {
    const { savedAt: _savedAt, bookingId: savedBookingId, id: _id, ...voucherData } = savedVoucher;
    setBookingId(savedBookingId);
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
            <button onClick={refreshData} disabled={loadingData} className="mb-4 text-sm font-bold text-green-light disabled:opacity-60">{loadingData ? "Carregando dados…" : "Atualizar agendamentos e vouchers"}</button>
            {dataError && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{dataError}</p>}
            <label className="mb-5 block text-sm font-bold">Solicitação pendente<select disabled={loadingData || !!dataError} className={fieldClass} onChange={(e) => selectBooking(e.target.value)} defaultValue=""><option value="">Preenchimento manual</option>{bookings.map((b) => <option key={b.id} value={b.id}>{b.code} — {b.name} — {b.date}</option>)}</select></label>
            {!loadingData && !dataError && bookings.length === 0 && <p className="mb-5 rounded-xl bg-sand p-3 text-xs leading-relaxed text-muted">Nenhuma solicitação pendente encontrada.</p>}
            <form key={formKey} onChange={update} onSubmit={(event) => event.preventDefault()} className="grid grid-cols-2 gap-4">
              <Field name="code" label="Código" value={voucher.code} /><Field name="date" label="Data" type="date" value={voucher.date} />
              <Field name="client" label="Nome do responsável" value={voucher.client} wide /><Field name="phone" label="Contato" value={voucher.phone} /><Field name="passengers" label="Passageiros" type="number" value={voucher.passengers} />
              <Field name="issuedAt" label="Data de emissão" type="date" value={voucher.issuedAt} /><Field name="arrivalTime" label="Previsão de chegada" type="time" value={voucher.arrivalTime} /><Field name="time" label="Horário" type="time" value={voucher.time} />
              <label className="text-sm font-bold">Valor base<div className="relative"><span className="pointer-events-none absolute left-3.5 top-1/2 mt-[3px] -translate-y-1/2 text-sm font-semibold text-muted">R$</span><input className={`${fieldClass} pl-10`} name="price" inputMode="numeric" placeholder="0,00" defaultValue={voucher.price.replace(/^R\$\s*/, "")} onInput={formatCurrencyInput} /></div></label>
              <Field name="service" label="Serviço" value={voucher.service} wide />
              <Field name="origin" label="Origem" value={voucher.origin} wide /><Field name="destination" label="Destino" value={voucher.destination} wide />
              <Field name="vehicle" label="Veículo" value={voucher.vehicle} /><Field name="driver" label="Motorista" value={voucher.driver} />
              <label className="col-span-2 text-sm font-bold">Forma de pagamento<select className={fieldClass} name="payment" defaultValue={voucher.payment}><option value="">Selecione</option><option value="Transferência Bancária">Transferência Bancária</option><option value="Depósito">Depósito</option><option value="Crédito">Crédito em 1x (+ R$ 10 por passageiro)</option><option value="Pix">Pix</option><option value="Dinheiro">Dinheiro</option></select></label>
              <label className="col-span-2 text-sm font-bold">Observações<textarea name="notes" defaultValue={voucher.notes} className={`${fieldClass} min-h-24 resize-y`} /></label>
            </form>
          </section>
          <section>
            <div className="mb-4 flex flex-wrap justify-end gap-3"><button onClick={() => { setModalOpen(true); void refreshData(); }} className="inline-flex items-center gap-2 rounded-full border border-[#c9dde3] bg-white px-5 py-3 font-bold text-green"><FolderOpen size={18} /> Ver vouchers</button><button disabled={generating || loadingData || !!dataError} onClick={() => generatePdf(voucher)} className="inline-flex items-center gap-2 rounded-full bg-green px-5 py-3 font-bold text-white disabled:opacity-60"><Download size={18} /> {generating ? "Salvando voucher…" : "Gerar voucher em PDF"}</button></div>
            <p className="mb-3 text-sm text-muted">Modelo padrão GLM • A4. Entrada de 50% e acréscimo do cartão calculados automaticamente.</p>
            {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
            {previewUrl ? <iframe title="Prévia do voucher padrão GLM" src={previewUrl} className="h-[900px] w-full rounded-lg border-0 bg-white shadow-lg" /> : <div className="rounded-xl bg-white p-10 text-muted">{error ? "Ajuste os dados para visualizar o voucher." : "Preparando prévia…"}</div>}
          </section>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#153d52]/70 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="saved-vouchers-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <section className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-[24px] bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-[#d7e7eb] px-6 py-5"><div><span className="text-xs font-extrabold uppercase tracking-[.18em] text-green-light">Histórico</span><h2 id="saved-vouchers-title" className="mt-1 text-2xl font-bold">Vouchers salvos</h2></div><button onClick={() => setModalOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-[#e8f2f5] text-muted hover:text-ink" aria-label="Fechar"><X size={20} /></button></header>
            <div className="p-6">
              {loadingData && <p role="status" className="mb-4 text-sm text-muted">Carregando vouchers…</p>}
              {dataError && <p role="alert" className="mb-4 text-sm text-red-700">{dataError}</p>}
              <input value={modalFilter} onChange={(event) => setModalFilter(event.target.value)} className="mb-5 w-full rounded-full border border-[#c9dde3] bg-[#f3f8fa] px-5 py-3 text-sm outline-none focus:border-green-light" placeholder="Filtrar por nome ou código" aria-label="Filtrar vouchers por nome ou código" />
              <div className="max-h-[52vh] space-y-3 overflow-y-auto pr-1">
                {filteredSavedVouchers.map((item) => (
                  <article key={`${item.code}-${item.savedAt}`} className="flex items-center gap-4 rounded-2xl border border-[#d7e7eb] p-4">
                    <div className="min-w-0 flex-1"><strong className="block truncate text-ink">{item.client || "Cliente sem nome"}</strong><span className="mt-1 block text-sm text-muted">{item.code || "Sem código"} • {formatDate(item.date)}</span></div>
                    <button onClick={() => viewSavedVoucher(item)} className="grid h-10 w-10 place-items-center rounded-full border border-[#c9dde3] text-green hover:border-green-light" title="Visualizar voucher" aria-label={`Visualizar voucher ${item.code}`}><Eye size={18} /></button>
                    <button onClick={() => generatePdf(item, false)} className="grid h-10 w-10 place-items-center rounded-full bg-green text-white hover:bg-green-light" title="Baixar voucher" aria-label={`Baixar voucher ${item.code}`}><Download size={18} /></button>
                  </article>
                ))}
                {!loadingData && !dataError && filteredSavedVouchers.length === 0 && <p className="rounded-2xl bg-sand p-6 text-center text-sm text-muted">Nenhum voucher salvo encontrado.</p>}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function Field({ name, label, type = "text", placeholder, value, wide = false }: { name: string; label: string; type?: string; placeholder?: string; value: string; wide?: boolean }) { return <label className={`text-sm font-bold ${wide ? "col-span-2" : ""}`}>{label}<input className={fieldClass} name={name} type={type} placeholder={placeholder} defaultValue={value} /></label>; }
