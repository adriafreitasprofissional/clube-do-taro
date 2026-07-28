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

const { data: checkout } = await supabaseAdmin
  .from("checkout_pendentes")
  .select("*")
  .eq("external_reference", referencia)
  .single();

if (!checkout) {
  console.log("Checkout pendente não encontrado.");
  return pagamento;
}

const email = checkout.email;
const nome = checkout.nome;
console.log("CHECKOUT ENCONTRADO:");
console.log(checkout);
console.log("EMAIL:", email);
console.log("NOME:", nome);


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


  const { data: novoUsuario, error } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      password: Math.random().toString(36).slice(-10),
    });

  console.log("USUÁRIO:", novoUsuario);
  console.log("ERRO:", error);

  return pagamento;
}

  console.log("CLIENTE:", cliente);

  console.log("=== PAGAMENTO ===");
  console.dir(pagamento, { depth: null });

  return pagamento;
}