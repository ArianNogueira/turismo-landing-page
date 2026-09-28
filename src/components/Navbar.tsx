"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function outside(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); }
    }
    const desktop = window.matchMedia("(min-width: 901px)");
    function resize() { if (desktop.matches) setMenuOpen(false); }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", resize);
    };
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="absolute top-0 z-40 w-full text-white" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMenuOpen(false); }}>
      <div className="mx-auto flex h-[88px] w-[min(1120px,calc(100%-40px))] items-center gap-7 max-[620px]:w-[min(1120px,calc(100%-28px))]">
        <a className="mr-auto shrink-0 text-xl font-extrabold" href="#inicio" onClick={() => setMenuOpen(false)}>
          <Image
            src="/Logo.png"
            alt="Logo da GLM Transporte e Turismo"
            width={90}
            height={40}
          />
        </a>
        <button ref={menuButton} type="button" onClick={() => setMenuOpen(current => !current)} aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green/80 text-white max-[900px]:inline-flex">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav id="main-navigation" onClick={() => setMenuOpen(false)}
          className={`flex gap-[26px] text-[.95rem] [&_a]:opacity-90 hover:[&_a]:opacity-100 max-[900px]:absolute max-[900px]:left-[14px] max-[900px]:right-[14px] max-[900px]:top-[80px] max-[900px]:max-h-[calc(100dvh-96px)] max-[900px]:overflow-y-auto max-[900px]:flex-col max-[900px]:gap-1 max-[900px]:rounded-2xl max-[900px]:bg-green max-[900px]:p-3 max-[900px]:shadow-xl max-[900px]:[&_a]:rounded-lg max-[900px]:[&_a]:px-4 max-[900px]:[&_a]:py-3 ${menuOpen ? "" : "max-[900px]:hidden"}`}
          aria-label="Navegação principal"
        >
          <a href="#inicio">Início</a>
          <a href="#passeios">Passeios</a>
          <a href="#transfers">Transfer privativo</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
      </div>
    </header>
  );
}
