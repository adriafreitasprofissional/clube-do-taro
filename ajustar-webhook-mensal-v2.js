const fs = require("fs");

const p = "src/lib/mercadopago/processarWebhook.ts";
let t = fs.readFileSync(p, "utf8");

const ponto1 = "const { error: erroInsert } = await supabaseAdmin";

const bloco1 = `const hoje = new Date();
const hojeTexto = hoje.toISOString().slice(0, 10);
const diaVencimento = hoje.getDate();

const ultimoDiaProximoMes = new Date(
  hoje.getFullYear(),
  hoje.getMonth() + 2,
  0
).getDate();

const diaProximoVencimento = Math.min(
  diaVencimento,
  ultimoDiaProximoMes
);

const proximoVencimentoData = new Date(
  hoje.getFullYear(),
  hoje.getMonth() + 1,
  diaProximoVencimento
);

const proximoVencimento = [
  proximoVencimentoData.getFullYear(),
  String(proximoVencimentoData.getMonth() + 1).padStart(2, "0"),
  String(proximoVencimentoData.getDate()).padStart(2, "0"),
].join("-");

const { error: erroInsert } = await supabaseAdmin`;

if (!t.includes(ponto1)) {
  throw new Error("Ponto 1 nao encontrado");
}

t = t.replace(ponto1, bloco1);

const ponto2 = `    data_inicio: new Date().toISOString().slice(0, 10),`;

const bloco2 = `    data_inicio: hojeTexto,
    tipo_assinatura: "mensal",
    ultimo_pagamento: hojeTexto,
    status_pagamento: "em_dia",
    dia_vencimento: diaVencimento,
    proximo_vencimento: proximoVencimento,`;

if (!t.includes(ponto2)) {
  throw new Error("Ponto 2 nao encontrado");
}

t = t.replace(ponto2, bloco2);

fs.writeFileSync(p, t, "utf8");

console.log("Webhook mensal atualizado com sucesso.");
