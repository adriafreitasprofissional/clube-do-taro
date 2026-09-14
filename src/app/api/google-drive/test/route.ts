import { NextResponse } from "next/server";
import { garantirPastaAssinante } from "@/lib/google-drive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const resultado = await garantirPastaAssinante({
      slug: "oceli",
      data: new Date("2026-09-13T12:00:00"),
    });

    return NextResponse.json({
      success: true,
      cliente: "oceli",
      ...resultado,
    });
  } catch (error) {
    console.error("ERRO TESTE GOOGLE DRIVE:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}