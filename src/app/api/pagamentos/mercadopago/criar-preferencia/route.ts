import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";

export async function POST(req: Request) {
  try {
    const { nome, email, plano, valor } = await req.json();

    const preference = new Preference(mpClient);

    const response = await preference.create({
  body: {
    items: [
      {
        id: plano,
        title: `Clube do Tarô - ${plano}`,
        quantity: 1,
        currency_id: "BRL",
        unit_price: Number(valor),
      },
    ],

    payer: {
      name: nome,
      email,
    },

    external_reference: crypto.randomUUID(),

    metadata: {
      produto: "clube",
      plano,
      tipo_usuario: "assinante",
    },
  },
});
    return NextResponse.json({
      ok: true,
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    });
  } catch (error) {
  console.error("Mercado Pago:", error);

  return NextResponse.json(
    {
      ok: false,
      erro: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}
}