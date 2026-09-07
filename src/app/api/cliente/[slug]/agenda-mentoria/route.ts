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

  if (
    String(cliente.status || "").toLowerCase() !== "ativo" ||
    String(cliente.plano || "").toLowerCase() !== "diamante"
  ) {
    return null;
  }

  return cliente;
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
    const { data: events, error: eventsError } =
      await supabaseAdmin
        .from("club_mentoring_events")
        .select("*")
        .neq("status", "cancelled")
        .order("starts_at", { ascending: true });

    if (eventsError) {
      return NextResponse.json(
        { error: eventsError.message },
        { status: 500 }
      );
    }

    const eventIds = (events || []).map((item) => item.id);
    let participations: any[] = [];

    if (eventIds.length) {
      const { data } = await supabaseAdmin
        .from("club_mentoring_participants")
        .select(
          "id, event_id, client_id, response, attendance, responded_at"
        )
        .eq("client_id", cliente.id)
        .in("event_id", eventIds);

      participations = data || [];
    }

    return NextResponse.json({
      cliente: {
        id: cliente.id,
        nome:
          cliente.nome_referencia ||
          cliente.nome ||
          "Mentorada",
        slug: cliente.slug,
      },
      events: events || [],
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

    if (!eventId) {
      return NextResponse.json(
        { error: "Mentoria não informada." },
        { status: 400 }
      );
    }

    if (action === "book_individual") {
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
