import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";

export async function processarWebhook(paymentId: string) {
  const payment = new Payment(mpClient);

  const pagamento = await payment.get({
    id: paymentId,
  });

  console.log("=== PAGAMENTO ===");
  console.dir(pagamento, { depth: null });

  return pagamento;
}