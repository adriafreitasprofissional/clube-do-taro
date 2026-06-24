import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: cliente, error } = await supabase
    .from("club_clients")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !cliente) {
    return NextResponse.json(
      { error: "Assinante não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(cliente);
}