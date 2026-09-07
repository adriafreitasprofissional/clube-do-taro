import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function bearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization") || "";

  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

async function autorizarAdmin(
  request: NextRequest
) {
  const token = bearerToken(request);

  if (!token) return false;

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);

  if (!user?.email) return false;

  const { data: admin } = await supabaseAdmin
    .from("club_clients")
    .select("id")
    .ilike("email", user.email)
    .eq("role", "admin")
    .maybeSingle();

  return Boolean(admin);
}

export async function GET(request: NextRequest) {
  if (!(await autorizarAdmin(request))) {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 401 }
    );
  }

  try {
    const clientId = String(
      request.nextUrl.searchParams.get(
        "client_id"
      ) || ""
    ).trim();

    if (!clientId) {
      return NextResponse.json(
        { error: "Cliente não informada." },
        { status: 400 }
      );
    }

    const {
      data: cliente,
      error: clienteError,
    } = await supabaseAdmin
      .from("club_clients")
      .select(
        "id, nome, nome_referencia, email, slug"
      )
      .eq("id", clientId)
      .maybeSingle();

    if (clienteError) {
      return NextResponse.json(
        { error: clienteError.message },
        { status: 500 }
      );
    }

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrada." },
        { status: 404 }
      );
    }

    const {
      data: anamnese,
      error: anamneseError,
    } = await supabaseAdmin
      .from("therapy_anamneses")
      .select("*")
      .eq("client_id", clientId)
      .eq("therapy_type", "Terapia TRG")
      .order("submitted_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (anamneseError) {
      return NextResponse.json(
        { error: anamneseError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      cliente: {
        id: cliente.id,
        nome:
          cliente.nome_referencia ||
          cliente.nome ||
          "Cliente",
        nome_completo:
          cliente.nome || "",
        email:
          cliente.email || "",
        slug:
          cliente.slug || "",
      },
      anamnese: anamnese || null,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar anamnese.",
      },
      { status: 500 }
    );
  }
}
