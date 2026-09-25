import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";

  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

async function clienteAutorizada(
  request: NextRequest,
  slug: string
) {
  const token = bearerToken(request);

  if (!token) return null;

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);

  if (!user?.email) return null;

  const { data: cliente } = await supabaseAdmin
    .from("club_clients")
    .select(
      "id, nome, nome_referencia, email, slug, plano, status"
    )
    .eq("slug", slug)
    .ilike("email", user.email)
    .maybeSingle();

  if (!cliente) return null;

  if (String(cliente.status || "").toLowerCase() !== "ativo") {
    return null;
  }

  return cliente;
}

function ehDiamante(plano: string | null) {
  return String(plano || "").toLowerCase() === "diamante";
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ slug: string }>;
  }
) {
  const { slug } = await context.params;
  const cliente = await clienteAutorizada(request, slug);

  if (!cliente) {
    return NextResponse.json(
      { error: "Acesso não autorizado para esta agenda." },
      { status: 401 }
    );
  }

  try {
    const diamante = ehDiamante(cliente.plano);

    const { data: participacoesCliente, error: participacoesError } =
      await supabaseAdmin
        .from("club_mentoring_participants")
        .select(
          "id, event_id, client_id, response, attendance, responded_at"
        )
        .eq("client_id", cliente.id);

    if (participacoesError) {
      return NextResponse.json(
        { error: participacoesError.message },
        { status: 500 }
      );
    }

    const participations = participacoesCliente || [];

    let events: any[] = [];

    if (diamante) {
      const { data, error } = await supabaseAdmin
        .from("club_mentoring_events")
        .select("*")
        .neq("status", "cancelled")
        .order("starts_at", { ascending: true });

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      events = data || [];
    } else {
      const eventIds = participations.map((item) => item.event_id);

      if (eventIds.length) {
        const { data, error } = await supabaseAdmin
          .from("club_mentoring_events")
          .select("*")
          .in("id", eventIds)
          .eq("event_type", "group")
          .neq("status", "cancelled")
          .order("starts_at", { ascending: true });

        if (error) {
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }

        events = data || [];
      }
    }

    return NextResponse.json({
      cliente: {
        id: cliente.id,
        nome:
          cliente.nome_referencia ||
          cliente.nome ||
          "Mentorada",
        slug: cliente.slug,
        plano: cliente.plano,
        eh_diamante: diamante,
      },
      events,
      participations,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar agenda.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{ slug: string }>;
  }
) {
  const { slug } = await context.params;
  const cliente = await clienteAutorizada(request, slug);

  if (!cliente) {
    return NextResponse.json(
      { error: "Acesso não autorizado para esta agenda." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const action = String(body.action || "").trim();
    const eventId = String(body.event_id || "").trim();
    const diamante = ehDiamante(cliente.plano);

    if (!eventId) {
      return NextResponse.json(
        { error: "Mentoria não informada." },
        { status: 400 }
      );
    }

    if (action === "book_individual") {
      if (!diamante) {
        return NextResponse.json(
          {
            error:
              "O agendamento de mentoria individual é exclusivo do Plano Diamante.",
          },
          { status: 403 }
        );
      }

      const { error } = await supabaseAdmin.rpc(
        "book_club_individual_mentoring",
        {
          p_event_id: eventId,
          p_client_id: cliente.id,
        }
      );

      if (error) {
        return NextResponse.json(
          {
            error:
              error.message.includes("Horário indisponível")
                ? "Este horário acabou de ser ocupado. Escolha outro."
                : error.message,
          },
          { status: 409 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Mentoria individual agendada.",
      });
    }

    if (action === "respond_group") {
      const response = String(body.response || "").trim();

      if (!["confirmed", "declined"].includes(response)) {
        return NextResponse.json(
          { error: "Resposta inválida." },
          { status: 400 }
        );
      }

      if (!diamante) {
        const { data: convite, error: conviteError } =
          await supabaseAdmin
            .from("club_mentoring_participants")
            .select("id")
            .eq("event_id", eventId)
            .eq("client_id", cliente.id)
            .maybeSingle();

        if (conviteError) {
          return NextResponse.json(
            { error: conviteError.message },
            { status: 500 }
          );
        }

        if (!convite) {
          return NextResponse.json(
            {
              error:
                "Você não possui convite para esta mentoria.",
            },
            { status: 403 }
          );
        }
      }

      const { error } = await supabaseAdmin.rpc(
        "respond_club_group_mentoring",
        {
          p_event_id: eventId,
          p_client_id: cliente.id,
          p_response: response,
        }
      );

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }

      return NextResponse.json({
        success: true,
        message:
          response === "confirmed"
            ? "Presença confirmada."
            : "Ausência informada.",
      });
    }

    return NextResponse.json(
      { error: "Ação inválida." },
      { status: 400 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar agenda.",
      },
      { status: 500 }
    );
  }
}