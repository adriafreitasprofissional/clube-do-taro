import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { enviarBoasVindas } from "@/lib/email/enviarBoasVindas";

export const runtime = "nodejs";

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  return authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    const token = bearerToken(request);
    if (!token) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (!user?.email) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

    const { data: admin } = await supabaseAdmin.from("club_clients").select("id").ilike("email", user.email).eq("role", "admin").maybeSingle();
    if (!admin) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Assinante não informada." }, { status: 400 });

    const { data: cliente, error } = await supabaseAdmin.from("club_clients").select("id,nome,email,senha_inicial").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!cliente) return NextResponse.json({ error: "Assinante não encontrada." }, { status: 404 });
    if (!cliente.email || !cliente.senha_inicial) return NextResponse.json({ error: "A assinante não possui e-mail ou senha inicial cadastrados." }, { status: 400 });

    await enviarBoasVindas({ nome: cliente.nome || "Assinante", email: cliente.email, senha: cliente.senha_inicial });

    return NextResponse.json({ success: true, email: cliente.email });
  } catch (error) {
    console.error("ERRO AO ENVIAR BOAS-VINDAS:", error);
    return NextResponse.json({ error: "Não foi possível enviar o e-mail de boas-vindas." }, { status: 500 });
  }
}
