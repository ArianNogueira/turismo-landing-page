"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function TravelRouteSelect({ options, value, onChange }: {
  options: readonly string[]; value: string; onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function show() { setActive(Math.max(0, options.indexOf(value))); setOpen(true); }
  function choose(index: number) {
    onChange(options[index]); setOpen(false); trigger.current?.focus();
  }

  return (
    <div ref={container} className="relative col-span-2 min-w-0 max-[700px]:col-span-1"
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
      <label id="booking-route-label" htmlFor="booking-route" className="block text-sm font-bold text-ink">Rota da viagem *</label>
      <input type="hidden" name="route" value={value} />
      <button ref={trigger} id="booking-route" type="button" role="combobox"
        aria-labelledby="booking-route-label" aria-haspopup="listbox" aria-expanded={open}
        aria-controls="booking-route-options" aria-required="true"
        aria-activedescendant={open ? `booking-route-option-${active}` : undefined}
        onClick={() => { if (open) setOpen(false); else show(); }}
        onKeyDown={(event) => {
          if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
          else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) show();
            else setActive(current => (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault(); setOpen(true); setActive(event.key === "Home" ? 0 : options.length - 1);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault(); if (open) choose(active); else show();
          } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            const index = options.findIndex(option => option.toLocaleLowerCase("pt-BR").startsWith(event.key.toLocaleLowerCase("pt-BR")));
            if (index >= 0) { event.preventDefault(); setOpen(true); setActive(index); }
          }
        }}
        className="mt-2 flex w-full items-center justify-between gap-3 rounded-xl border border-[#c9dde3] bg-white px-4 py-3 text-left text-sm font-bold text-ink focus:border-green-light focus:ring-4 focus:ring-green-light/10">
        <span>{value || "Selecione a rota"}</span><ChevronDown size={18} aria-hidden="true" className={open ? "shrink-0 rotate-180" : "shrink-0"} />
      </button>
      {open && <ul id="booking-route-options" role="listbox" aria-labelledby="booking-route-label"
        className="absolute left-0 right-0 top-full z-30 mt-1 rounded-xl border border-[#c9dde3] bg-white p-1 shadow-xl">
        {options.map((option, index) => <li key={option} id={`booking-route-option-${index}`} role="option" aria-selected={value === option}
          onPointerDown={(event) => event.preventDefault()}
          onPointerMove={() => setActive(index)} onClick={() => choose(index)}
          className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm ${active === index ? "bg-[#e8f2f5] text-green" : "text-ink"} ${value === option ? "font-bold" : ""}`}>
          {option}{value === option && <Check size={16} aria-hidden="true" />}
        </li>)}
      </ul>}
    </div>
  );
}
