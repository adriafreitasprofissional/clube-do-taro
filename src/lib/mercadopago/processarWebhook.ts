import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function processarWebhook(paymentId: string) {
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
    .eq("email", pagamento.payer.email)
    .maybeSingle();

  console.log("CLIENTE:", cliente);

  console.log("=== PAGAMENTO ===");
  console.dir(pagamento, { depth: null });

  return pagamento;
}