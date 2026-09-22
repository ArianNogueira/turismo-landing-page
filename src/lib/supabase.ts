import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export function getSupabase() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Configure a URL e a chave pública do Supabase para conectar o site.");
  client = createClient(url, key);
  return client;
}

export function databaseError(error: { code?: string; message: string }) {
  if (error.code === "42501") return new Error("Acesso não autorizado. Confira o login da equipe e as permissões do banco.");
  if (error.code === "42P01" || error.code === "PGRST205") return new Error("As tabelas ainda não foram configuradas no Supabase.");
  if (error.code === "23505") return new Error("Já existe um registro com esse código.");
  if (["23514", "23502", "22007", "22008"].includes(error.code || "")) {
    return new Error("Confira os campos obrigatórios, datas, passageiros e valor informado.");
  }
  return new Error("Não foi possível acessar o banco de dados. Verifique sua conexão e tente novamente.");
}
