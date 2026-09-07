import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTherapyAdmin } from "../../_auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ clientId: string }> }
) {
  const admin = await getTherapyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }

  const { clientId } = await context.params;

  const { data: cliente } = await supabaseAdmin
    .from("club_clients")
    .select("id, nome, nome_referencia, email, slug")
    .eq("id", clientId)
    .maybeSingle();

  if (!cliente) {
    return NextResponse.json({ error: "Cliente não encontrada." }, { status: 404 });
  }

  const { data: anamnese, error } = await supabaseAdmin
    .from("therapy_anamneses")
    .select("*")
    .eq("client_id", clientId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    cliente: {
      id: cliente.id,
      nome: cliente.nome_referencia || cliente.nome || "Cliente",
      nome_completo: cliente.nome || "",
      email: cliente.email || "",
      slug: cliente.slug || "",
    },
    anamnese: anamnese || null,
  });
}
