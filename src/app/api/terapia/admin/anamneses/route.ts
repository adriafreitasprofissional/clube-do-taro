import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTherapyAdmin } from "../_auth";

function rel(item: any) {
  return Array.isArray(item) ? item[0] || null : item || null;
}

export async function GET(request: NextRequest) {
  const admin = await getTherapyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }

  const { data: acessos, error } = await supabaseAdmin
    .from("therapy_client_access")
    .select(`
      client_id,
      club_clients (id, nome, nome_referencia, email, slug)
    `)
    .eq("active", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const clientes = (acessos || []).map((item: any) => {
    const c = rel(item.club_clients);
    if (!c) return null;
    return {
      id: item.client_id,
      nome: c.nome_referencia || c.nome || "Cliente",
      nome_completo: c.nome || "",
      email: c.email || "",
      slug: c.slug || "",
    };
  }).filter(Boolean) as any[];

  const ids = clientes.map((c) => c.id);
  let anamneses: any[] = [];

  if (ids.length) {
    const { data } = await supabaseAdmin
      .from("therapy_anamneses")
      .select("id, client_id, status, submitted_at")
      .in("client_id", ids)
      .order("submitted_at", { ascending: false });
    anamneses = data || [];
  }

  const latest = new Map<string, any>();
  for (const a of anamneses) {
    if (!latest.has(a.client_id)) latest.set(a.client_id, a);
  }

  return NextResponse.json({
    clientes: clientes.map((c) => ({
      ...c,
      anamnese: latest.get(c.id) || null,
    })),
  });
}
