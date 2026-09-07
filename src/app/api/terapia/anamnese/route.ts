import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function buscarAcesso(token: string) {
  const { data, error } = await supabaseAdmin
    .from("therapy_client_access")
    .select(`
      id,
      client_id,
      professional,
      active,
      expires_at,
      club_clients (
        id,
        nome,
        nome_referencia,
        email,
        slug
      )
    `)
    .eq("access_token", token)
    .eq("active", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  if (
    data.expires_at &&
    new Date(data.expires_at).getTime() < Date.now()
  ) {
    return null;
  }

  return data;
}

function normalizarCliente(relacao: any) {
  if (Array.isArray(relacao)) {
    return relacao[0] || null;
  }

  return relacao || null;
}

export async function GET(request: NextRequest) {
  try {
    const token = String(
      request.nextUrl.searchParams.get("token") || ""
    ).trim();

    if (!token) {
      return NextResponse.json(
        { error: "Acesso não informado." },
        { status: 400 }
      );
    }

    const acesso = await buscarAcesso(token);

    if (!acesso) {
      return NextResponse.json(
        { error: "Este acesso não é válido ou expirou." },
        { status: 401 }
      );
    }

    const cliente =
      normalizarCliente(acesso.club_clients);

    const { data: existente } =
      await supabaseAdmin
        .from("therapy_anamneses")
        .select(
          "id, status, submitted_at"
        )
        .eq("client_id", acesso.client_id)
        .eq("therapy_type", "Terapia TRG")
        .order("submitted_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    return NextResponse.json(
      {
        cliente: {
          id: acesso.client_id,
          nome:
            cliente?.nome_referencia ||
            cliente?.nome ||
            "Cliente",
          nome_completo:
            cliente?.nome || "",
          email:
            cliente?.email || "",
        },
        professional:
          acesso.professional,
        ja_preenchida:
          existente?.status === "enviada" ||
          existente?.status === "revisada",
        submitted_at:
          existente?.submitted_at || null,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar a anamnese.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const token = String(
      body.token || ""
    ).trim();

    const answers =
      body.answers &&
      typeof body.answers === "object"
        ? body.answers
        : null;

    if (!token || !answers) {
      return NextResponse.json(
        {
          error:
            "Não foi possível identificar o acesso ou as respostas.",
        },
        { status: 400 }
      );
    }

    const acesso = await buscarAcesso(token);

    if (!acesso) {
      return NextResponse.json(
        { error: "Este acesso não é válido ou expirou." },
        { status: 401 }
      );
    }

    const {
      data: existente,
      error: existenteError,
    } = await supabaseAdmin
      .from("therapy_anamneses")
      .select("id, status")
      .eq("client_id", acesso.client_id)
      .eq("therapy_type", "Terapia TRG")
      .order("submitted_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (existenteError) {
      return NextResponse.json(
        { error: existenteError.message },
        { status: 500 }
      );
    }

    if (
      existente?.status === "enviada" ||
      existente?.status === "revisada"
    ) {
      return NextResponse.json(
        {
          success: true,
          already_submitted: true,
          anamnese_id: existente.id,
        },
        { status: 200 }
      );
    }

    const { data, error } =
      await supabaseAdmin
        .from("therapy_anamneses")
        .insert({
          client_id: acesso.client_id,
          professional:
            acesso.professional,
          therapy_type: "Terapia TRG",
          answers,
          status: "enviada",
          submitted_at:
            new Date().toISOString(),
        })
        .select("id, submitted_at")
        .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        anamnese_id: data.id,
        submitted_at:
          data.submitted_at,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao enviar a anamnese.",
      },
      { status: 500 }
    );
  }
}
