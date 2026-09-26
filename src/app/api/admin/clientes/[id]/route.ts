import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
}
async function autorizarAdmin(request: NextRequest) {
  const token = bearerToken(request);
  if (!token) return false;
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  if (!user?.email) return false;
  const { data: admin } = await supabaseAdmin.from("club_clients").select("id").ilike("email", user.email).eq("role", "admin").maybeSingle();
  return Boolean(admin);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await autorizarAdmin(request))) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    const { id } = await params;
    const { data: cliente, error } = await supabaseAdmin.from("club_clients").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!cliente) return NextResponse.json({ error: "Assinante não encontrada." }, { status: 404 });
    const { senha_inicial, ...dadosSeguros } = cliente;
    return NextResponse.json(dadosSeguros);
  } catch (error) {
    console.error("ERRO AO BUSCAR ASSINANTE:", error);
    return NextResponse.json({ error: "Não foi possível carregar a assinante." }, { status: 500 });
  }
}
