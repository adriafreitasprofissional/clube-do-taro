import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

function bearerToken(request: NextRequest) {

  const authorization =
    request.headers.get("authorization") || "";

  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

export async function POST(
  request: NextRequest
) {
  try {
    const token = bearerToken(request);

    if (!token) {
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

    const body = await request.json();

    const sourceId =
      String(body.source_id || "").trim();

    const interactionType =
      String(
        body.interaction_type || ""
      ).trim();

    const message =
      String(body.message || "").trim();

    if (
      !sourceId ||
      !interactionType ||
      !message
    ) {
      return NextResponse.json(
        {
          error:
            "Tipo e mensagem são obrigatórios.",
        },
        { status: 400 }
      );
    }

    if (
      ![
        "feedback",
        "sugestao",
        "duvida",
      ].includes(interactionType)
    ) {
      return NextResponse.json(
        {
          error:
            "Tipo de interação inválido.",
        },
        { status: 400 }
      );
    }

    const { data: cliente } =
      await supabaseAdmin
        .from("club_clients")
        .select("id, email, status")
        .ilike("email", user.email)
        .maybeSingle();

    if (!cliente) {
      return NextResponse.json(
        {
          error:
            "Assinante não encontrada.",
        },
        { status: 404 }
      );
    }

    if (
      String(cliente.status || "")
        .toLowerCase() !== "ativo"
    ) {
      return NextResponse.json(
        {
          error:
            "Este acesso não está ativo.",
        },
        { status: 403 }
      );
    }

    const { data: mentoria } =
      await supabaseAdmin
        .from("client_service_records")
        .select(
          "id, client_id, service_type, published"
        )
        .eq("id", sourceId)
        .eq("client_id", cliente.id)
        .eq("service_type", "mentoria")
        .eq("published", true)
        .maybeSingle();

    if (!mentoria) {
      return NextResponse.json(
        {
          error:
            "Mentoria não encontrada.",
        },
        { status: 404 }
      );
    }

    const { data, error } =
      await supabaseAdmin
        .from("client_interactions")
        .insert({
          client_id: cliente.id,
          source_type: "mentoria",
          source_id: mentoria.id,
          interaction_type:
            interactionType,
          message,
          status: "novo",
        })
        .select(
          `
            id,
            source_type,
            source_id,
            interaction_type,
            message,
            status,
            created_at
          `
        )
        .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        interaction: data,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao enviar sua mensagem.",
      },
      { status: 500 }
    );
  }
}