import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📩 Webhook PagBank recebido:");
    console.log(JSON.stringify(body, null, 2));

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Erro no webhook:", error);

    return NextResponse.json(
      { error: "Erro ao processar webhook." },
      { status: 500 }
    );
  }
}