import { NextResponse } from "next/server";
import { processarWebhook } from "@/lib/mercadopago/processarWebhook";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const paymentId = searchParams.get("data.id");
    const type = searchParams.get("type");

    console.log({ paymentId, type });

    if (type === "payment" && paymentId) {
      await processarWebhook(paymentId);
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}