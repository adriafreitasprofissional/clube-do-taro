import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function processarWebhook(paymentId: string) {
 console.log("VERSAO 2 - 01:35");
  const payment = new Payment(mpClient);

  const pagamento = await payment.get({
    id: paymentId,
  });

console.log("PAGAMENTO COMPLETO:");
console.log(JSON.stringify(pagamento, null, 2));


  if (pagamento.status !== "approved") {
    return pagamento;
  }

  const referencia = pagamento.external_reference;

const { data: checkout, error: erroCheckout } = await supabaseAdmin
  .from("checkout_pendentes")
  .select("*")
  .eq("external_reference", referencia)
  .single();

if (!checkout) {
  console.log("Checkout pendente não encontrado.");
  return pagamento;
}

if (checkout.status === "processado") {
  console.log("Pagamento já processado.");
  return pagamento;
}


const email = checkout.email;
const nome = checkout.nome;
console.log("CHECKOUT ENCONTRADO:");
console.log(checkout);
console.log("EMAIL:", email);
console.log("NOME:", nome);


console.log("REFERÊNCIA:", referencia);
console.log("CHECKOUT:", checkout);
console.log("ERRO CHECKOUT:", erroCheckout);

  const { data: cliente } = await supabaseAdmin
  .from("club_clients")
  .select("*")
  .eq("email", email)
  .maybeSingle();


if (!cliente) {
  console.log("NOVO ASSINANTE");

 
  console.log("PAYER:", JSON.stringify(pagamento.payer, null, 2));
console.log(
  "ADDITIONAL_INFO:",
  JSON.stringify(pagamento.additional_info, null, 2)
);
const senha = Math.random().toString(36).slice(-10);

const { data: novoUsuario, error } =
  await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    password: senha,
  });

if (error && error.code !== "email_exists") {
  console.error(error);
  return pagamento;
}


const userId =
  novoUsuario?.user?.id ??
  (
    await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    })
  ).data.users.find((u) => u.email === email)?.id;

if (!userId) {
  console.error("Não foi possível obter o ID do usuário.");
  return pagamento;
}

const { error: erroInsert } = await supabaseAdmin
  .from("club_clients")
  .insert({
    id: userId,
    nome,
    email,
    plano: checkout.plano.toLowerCase(),
    status: "ativo",
    slug: email.split("@")[0],
    senha_inicial: "alterar-no-primeiro-login",
    data_inicio: new Date().toISOString().slice(0, 10),
    role: "cliente",
    metodo_pagamento: "mercadopago",
    produto: "Clube do Tarô",
  });

console.log("ERRO INSERT:", erroInsert);

if (!erroInsert) {
  await supabaseAdmin
    .from("checkout_pendentes")
    .update({
      status: "processado",
      payment_id: Number(pagamento.id),
    })
    .eq("external_reference", referencia);
}

  console.log("CLIENTE:", cliente);

  console.log("=== PAGAMENTO ===");
  console.dir(pagamento, { depth: null });

  return pagamento;
}

console.log("CLIENTE:", cliente);

return pagamento;
}
