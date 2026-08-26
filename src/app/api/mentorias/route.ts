import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

function bearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization") || "";

  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

export async function GET(request: NextRequest) {
  const slug =
    request.nextUrl.searchParams.get("slug")?.trim();

  const token = bearerToken(request);

  if (!slug || !token) {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 401 }
    );
  }

  const {
    data: { user },
    error: usuarioError,
  } = await supabaseAdmin.auth.getUser(token);

  if (usuarioError || !user?.email) {
    return NextResponse.json(
      {
        error:
          "Sessão inválida. Entre novamente no portal.",
      },
      { status: 401 }
    );
  }

  const { data: cliente, error: clienteError } =
    await supabaseAdmin
      .from("club_clients")
      .select(
        "id, nome, nome_referencia, email, slug, plano, status, role"
      )
      .eq("slug", slug)
      .maybeSingle();

  if (clienteError || !cliente) {
    return NextResponse.json(
      { error: "Assinante não encontrada." },
      { status: 404 }
    );
  }

  const mesmoEmail =
    String(cliente.email || "").toLowerCase() ===
    user.email.toLowerCase();

  const ehAdmin =
    String(cliente.role || "").toLowerCase() === "admin";

  if (!mesmoEmail && !ehAdmin) {
    return NextResponse.json(
      {
        error:
          "Você não pode acessar as mentorias desta assinante.",
      },
      { status: 403 }
    );
  }

  if (
    String(cliente.status || "").toLowerCase() !== "ativo"
  ) {
    return NextResponse.json(
      { error: "Este acesso não está ativo." },
      { status: 403 }
    );
  }

  const { data: registros, error: registrosError } =
    await supabaseAdmin
      .from("client_service_records")
      .select(`
        id,
        service_type,
        title,
        occurred_at,
        video_provider,
        video_file_id,
        report_adria,
        report_estella,
        pdf_file_id
      `)
      .eq("client_id", cliente.id)
      .eq("service_type", "mentoria")
      .eq("published", true)
      .order("occurred_at", { ascending: false });

  if (registrosError) {
    return NextResponse.json(
      { error: registrosError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    cliente: {
      nome: cliente.nome_referencia || cliente.nome,
      plano: cliente.plano,
    },

    registros: registros || [],
  });
}