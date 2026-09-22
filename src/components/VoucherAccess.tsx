"use client";

import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import { VoucherGenerator } from "@/components/VoucherGenerator";

export function VoucherAccess() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const { data: { subscription } } = getSupabase().auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      });
      return () => subscription.unsubscribe();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível conectar.");
      setLoading(false);
    }
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      const { error: authError } = await getSupabase().auth.signInWithPassword({
        email: String(data.get("email") || "").trim(), password: String(data.get("password") || ""),
      });
      if (authError) throw new Error("Não foi possível entrar. Confira e-mail, senha e conexão.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível entrar."); }
    finally { setBusy(false); }
  }

  async function signOut() {
    setBusy(true); setError("");
    try {
      const { error: authError } = await getSupabase().auth.signOut();
      if (authError) throw authError;
      setUser(null);
    } catch { setError("Não foi possível sair. Tente novamente."); }
    finally { setBusy(false); }
  }

  if (loading) return <main className="min-h-screen bg-[#e8f2f5] p-10 text-center">Verificando acesso…</main>;
  if (user?.app_metadata?.glm_role === "operator") return <>
    <div className="flex items-center justify-end gap-4 bg-white px-6 py-3 text-sm">
      {error && <span role="alert" className="text-red-700">{error}</span>}
      <span>{user.email}</span><button disabled={busy} onClick={signOut} className="font-bold text-green">Sair</button>
    </div>
    <VoucherGenerator key={user.id} />
  </>;

  return <main className="grid min-h-screen place-items-center bg-[#e8f2f5] p-6">
    <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold">Acesso da equipe</h1>
      <p className="mt-3 text-sm text-muted">Entre para consultar agendamentos e preparar vouchers.</p>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {user ? <div className="mt-6">
        <p role="alert">Seu usuário ainda não tem acesso à área operacional. Solicite a liberação ao administrador.</p>
        <button onClick={signOut} disabled={busy} className="mt-5 font-bold text-green">Sair e entrar com outro usuário</button>
      </div> : <form onSubmit={signIn} className="mt-6 space-y-4">
        <label className="block text-sm font-bold">E-mail<input name="email" type="email" autoComplete="username" required className="mt-2 w-full rounded-xl border p-3" /></label>
        <label className="block text-sm font-bold">Senha<input name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-xl border p-3" /></label>
        <button disabled={busy} className="w-full rounded-full bg-green px-6 py-3 font-bold text-white disabled:opacity-60">{busy ? "Entrando…" : "Entrar"}</button>
      </form>}
    </section>
  </main>;
}
