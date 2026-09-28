const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const source = ts.transpileModule(
  readFileSync("src/lib/booking-notification.ts", "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } },
).outputText;
const booking = {
  name: "Cliente de teste", phone: "98999999999", email: "cliente@example.com",
  service: "Transfer", date: "2026-10-15", time: "14:00", passengers: "3",
  origin: "Aeroporto", destination: "Hotel", reference: "", notes: "Uma mala",
};

function load(fetch, timers = {}) {
  const context = { exports: {}, process: { env: { NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: "test-access-key" } }, fetch, AbortController, setTimeout, clearTimeout, ...timers };
  vm.runInNewContext(source, context);
  return context.exports.notifyBooking;
}

test("envia os dados do pedido e aceita confirmação do serviço", async () => {
  const notify = load(async (url, options) => {
    assert.equal(url, "https://api.web3forms.com/submit");
    assert.equal(options.method, "POST");
    const data = JSON.parse(options.body);
    assert.equal(data.access_key, "test-access-key");
    assert.equal(data.email, booking.email);
    assert.equal(data.Telefone, booking.phone);
    assert.equal(data.Data, "15/10/2026");
    assert.equal(data.Passageiros, "3");
    assert.equal(data.Origem, "Aeroporto");
    assert.equal(data.Destino, "Hotel");
    assert.equal(data.Observações, "Uma mala");
    return { ok: true, json: async () => ({ success: true }) };
  });
  assert.equal(await notify(booking), true);
});

test("permite agendamento sem e-mail e horário opcionais", async () => {
  const notify = load(async (_, options) => {
    const data = JSON.parse(options.body);
    assert.equal(Object.hasOwn(data, "email"), false);
    assert.equal(data.Horário, "Não informado");
    return { ok: true, json: async () => ({ success: true }) };
  });
  assert.equal(await notify({ ...booking, email: "", time: "" }), true);
});

test("rejeição HTTP ou do serviço não lança erro para o pedido já salvo", async () => {
  for (const response of [
    { ok: false, json: async () => ({ success: true }) },
    { ok: true, json: async () => ({ success: false }) },
    { ok: true, json: async () => ({}) },
    { ok: true, json: async () => { throw new SyntaxError("Invalid JSON"); } },
  ]) {
    assert.equal(await load(async () => response)(booking), false);
  }
});

test("falha de rede retorna falha de notificação sem lançar erro", async () => {
  assert.equal(await load(async () => { throw new Error("Offline"); })(booking), false);
});

test("tempo limite cancela envio e libera o temporizador", async () => {
  let cleared = false;
  const notify = load((_, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener("abort", () => reject(new Error("Aborted")));
  }), {
    setTimeout(callback, delay) {
      assert.equal(delay, 15000);
      queueMicrotask(callback);
      return 1;
    },
    clearTimeout(id) { assert.equal(id, 1); cleared = true; },
  });
  assert.equal(await notify(booking), false);
  assert.equal(cleared, true);
});

test("sem chave configurada não envia requisição", async () => {
  let called = false;
  const notify = load(async () => { called = true; }, { process: { env: {} } });
  assert.equal(await notify(booking), false);
  assert.equal(called, false);
});
