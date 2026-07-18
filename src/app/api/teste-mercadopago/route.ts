import { NextResponse } from "next/server";
import { mpClient } from "@/lib/mercadopago";

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      configurado: !!mpClient,
      token: process.env.MP_ACCESS_TOKEN
        ? "TOKEN ENCONTRADO"
        : "TOKEN NÃO ENCONTRADO",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Erro ao inicializar Mercado Pago",
      },
      { status: 500 }
    );
  }
}