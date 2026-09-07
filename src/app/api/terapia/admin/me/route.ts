import { NextRequest, NextResponse } from "next/server";
import { getTherapyAdmin } from "../_auth";

export async function GET(request: NextRequest) {
  const admin = await getTherapyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 401 }
    );
  }

  return NextResponse.json({ admin });
}
