import { NextRequest, NextResponse } from "next/server";
import { processarWebhook } from "@/lib/mercadopago/processarWebhook";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { erro: "Informe o id do pagamento." },
      { status: 400 }
    );
  }

  try {
    const resultado = await processarWebhook(id);

    return NextResponse.json({
      sucesso: true,
      resultado,
    });
  } catch (erro) {
    console.error(erro);

    return NextResponse.json(
      { sucesso: false, erro },
      { status: 500 }
    );
  }
}