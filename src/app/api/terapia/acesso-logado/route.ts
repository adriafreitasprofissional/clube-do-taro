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
  try {
    const token = bearerToken(request);

    if (!token) {
      return NextResponse.json(
        { error: "Login não encontrado." },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: "Sessão inválida." },
        { status: 401 }
      );
    }

    const { data: cliente, error: clienteError } =
      await supabaseAdmin
        .from("club_clients")
       .select("id, nome, email, role")
        .ilike("email", user.email)
        .maybeSingle();

    if (clienteError || !cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrada." },
        { status: 404 }
      );
    }
if (cliente.role === "admin") {
  return NextResponse.json({
    success: true,
    tipo: "admin",
  });
}
    const { data: acesso, error: acessoError } =
      await supabaseAdmin
        .from("therapy_client_access")
        .select(`
          access_token,
          active,
          expires_at
        `)
        .eq("client_id", cliente.id)
        .eq("active", true)
        .maybeSingle();

    if (acessoError || !acesso) {
      return NextResponse.json(
        {
          error:
            "Você ainda não possui acesso ao Terapia em Dia.",
        },
        { status: 403 }
      );
    }

    if (
      acesso.expires_at &&
      new Date(acesso.expires_at).getTime() <
        Date.now()
    ) {
      return NextResponse.json(
        { error: "Seu acesso expirou." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      access_token: acesso.access_token,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível abrir seu portal.",
      },
      { status: 500 }
    );
  }
}