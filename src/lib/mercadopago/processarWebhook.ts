import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function processarWebhook(paymentId: string) {
  console.log("CHEGUEI NO PROCESSAR WEBHOOK");

  const payment = new Payment(mpClient);

  const pagamento = await payment.get({
    id: paymentId,
  });

  if (pagamento.status !== "approved") {
    return pagamento;
  }

  const { data: cliente } = await supabaseAdmin
    .from("club_clients")
    .select("*")
    .eq("email", pagamento.payer?.email ?? "")
    .maybeSingle();

   if (!cliente) {
  console.log("NOVO ASSINANTE");

  const email = pagamento.payer?.email ?? "";

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