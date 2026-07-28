import { NextResponse } from "next/server";
import { processarWebhook } from "@/lib/mercadopago/processarWebhook";

export async function POST(req: Request) {
  try {
   const { searchParams } = new URL(req.url);

const id = searchParams.get("id");
const topic = searchParams.get("topic");

console.log({ id, topic });

if (topic === "payment" && id) {
  await processarWebhook(id);
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