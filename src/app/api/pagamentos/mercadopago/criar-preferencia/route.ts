import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";

const corsHeaders = {
  "Access-Control-Allow-Origin":
    "https://clube-do-taro-landing.vercel.app",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};



export async function POST(req: Request) {
  console.log("🔥 ENTREI NA API criar-preferencia");
  try {

    
    const { plano, valor } = await req.json();

    console.log("=== DADOS RECEBIDOS ===");
    console.log({
      plano,
      valor,
    });

    const preference = new Preference(mpClient);

    const body = {
      items: [
        {
          id: plano,
          title: `Clube do Tarô - ${plano}`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: Number(valor),
        },
      ],

      metadata: {
        produto: "clube",
        plano,
        tipo_usuario: "assinante",
      },

      back_urls: {
        success: "https://www.magiaoriente.com.br/pagamento/sucesso",
        failure: "https://www.magiaoriente.com.br/pagamento/falha",
        pending: "https://www.magiaoriente.com.br/pagamento/pendente",
      },

      auto_return: "approved",

      notification_url:
        "https://www.magiaoriente.com.br/api/pagamentos/mercadopago/webhook",

      external_reference: crypto.randomUUID(),
    };

    console.log("=== BODY ENVIADO ===");
    console.dir(body, { depth: null });

    const response = await preference.create({
      body,
    });

    console.log("=== PREFERENCE CRIADA ===");
    console.dir(response, { depth: null });

    return NextResponse.json(
      {
        ok: true,
        preferenceId: response.id,
        initPoint: response.init_point,
        sandboxInitPoint: response.sandbox_init_point,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    console.error("=== MERCADO PAGO ERRO ===");
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        erro: error?.message ?? null,
        causa: error?.cause ?? null,
        status: error?.status ?? null,
        response: error?.response ?? null,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}