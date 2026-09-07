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

  if (!token) {
    return false;
  }

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);

  if (!user?.email) {
    return false;
  }

  const { data: admin } = await supabaseAdmin
    .from("club_clients")
    .select("id")
    .ilike("email", user.email)
    .eq("role", "admin")
    .maybeSingle();

  return Boolean(admin);
}

async function espelhoAtivo(professional: string) {
  const { data } = await supabaseAdmin
    .from("professional_schedule_settings")
    .select("mirror_club_therapy")
    .eq("professional", professional)
    .maybeSingle();

  return data?.mirror_club_therapy === true;
}

async function existeConflito({
  professional,
  scheduledAt,
  durationMinutes,
  excludeAppointmentId = null,
}: {
  professional: string;
  scheduledAt: string;
  durationMinutes: number;
  excludeAppointmentId?: string | null;
}) {
  const mirror = await espelhoAtivo(professional);

  const { data, error } = await supabaseAdmin.rpc(
    "professional_schedule_has_conflict",
    {
      p_professional: professional,
      p_starts_at: scheduledAt,
      p_duration_minutes: durationMinutes,
      p_include_appointments: true,
      p_include_mentoring: mirror,
      p_exclude_appointment_id: excludeAppointmentId,
      p_exclude_mentoring_event_id: null,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return data === true;
}

const CAMPOS = `
  id,
  client_id,
  service_type,
  professional,
  scheduled_at,
  duration_minutes,
  status,
  notes,
  meet_url,
  charge_type,
  amount,
  private_session_notes,
  evolution_summary,
  client_activity,
  published_to_client,
  completed_at,
  created_at,
  updated_at,
  club_clients (
    nome,
    nome_referencia,
    slug
  )
`;

function normalizarCliente(relacao: any) {
  if (Array.isArray(relacao)) {
    return relacao[0] || null;
  }

  return relacao || null;
}

function mapearAtendimento(item: any) {
  const cliente = normalizarCliente(
    item.club_clients
  );

  return {
    id: item.id,
    client_id: item.client_id,
    client_name:
      cliente?.nome_referencia ||
      cliente?.nome ||
      "Cliente",
    client_slug: cliente?.slug || null,

    service_type: item.service_type,
    professional: item.professional,

    scheduled_at: item.scheduled_at,
    duration_minutes: item.duration_minutes,
    status: item.status,

    notes: item.notes,
    meet_url: item.meet_url,

    charge_type: item.charge_type,
    amount: item.amount,

    private_session_notes:
      item.private_session_notes,
    evolution_summary:
      item.evolution_summary,
    client_activity:
      item.client_activity,
    published_to_client:
      item.published_to_client,
    completed_at:
      item.completed_at,

    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

export async function GET(
  request: NextRequest
) {
  if (!(await autorizarAdmin(request))) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const id =
      request.nextUrl.searchParams.get("id");

    if (id) {
      const { data, error } =
        await supabaseAdmin
          .from("appointments")
          .select(CAMPOS)
          .eq("id", id)
          .single();

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }

      return NextResponse.json({
        atendimento: mapearAtendimento(data),
      });
    }

    const { data, error } = await supabaseAdmin
      .from("appointments")
      .select(CAMPOS)
      .order("scheduled_at", {
        ascending: true,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      atendimentos: (data || []).map(
        mapearAtendimento
      ),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar a agenda.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  if (!(await autorizarAdmin(request))) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const clientId = String(
      body.client_id || ""
    ).trim();

    const serviceType = String(
      body.service_type || ""
    ).trim();

    const professional = String(
      body.professional || ""
    ).trim();

    const date = String(body.date || "").trim();
    const time = String(body.time || "").trim();

    const durationMinutes = Number(
      body.duration_minutes || 60
    );

    const notes =
      String(body.notes || "").trim() || null;

    const meetUrl =
      String(body.meet_url || "").trim() || null;

    const chargeType = String(
      body.charge_type || "incluido_pacote"
    ).trim();

    const amount =
      body.amount === null ||
      body.amount === undefined ||
      body.amount === ""
        ? null
        : Number(body.amount);

    if (
      !clientId ||
      !serviceType ||
      !professional ||
      !date ||
      !time
    ) {
      return NextResponse.json(
        {
          error:
            "Cliente, atendimento, profissional, data e horário são obrigatórios.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(durationMinutes) ||
      durationMinutes <= 0
    ) {
      return NextResponse.json(
        { error: "Duração inválida." },
        { status: 400 }
      );
    }

    if (
      amount !== null &&
      (!Number.isFinite(amount) || amount < 0)
    ) {
      return NextResponse.json(
        { error: "Valor inválido." },
        { status: 400 }
      );
    }

    const scheduledAt =
      `${date}T${time}:00-03:00`;

    const { data: cliente, error: clienteError } =
      await supabaseAdmin
        .from("club_clients")
        .select("id")
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

    if (
      await existeConflito({
        professional,
        scheduledAt,
        durationMinutes,
      })
    ) {
      return NextResponse.json(
        {
          error:
            "Este horário já está ocupado na Agenda-Mãe. Escolha outro horário.",
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("appointments")
      .insert({
        client_id: clientId,
        service_type: serviceType,
        professional,
        scheduled_at: scheduledAt,
        duration_minutes: durationMinutes,
        status: "agendado",
        notes,
        meet_url: meetUrl,
        charge_type: chargeType,
        amount,
      })
      .select(CAMPOS)
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
        atendimento: mapearAtendimento(data),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao salvar o atendimento.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest
) {
  if (!(await autorizarAdmin(request))) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const id = String(body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "Atendimento não informado." },
        { status: 400 }
      );
    }

    const { data: atual, error: atualError } =
      await supabaseAdmin
        .from("appointments")
        .select("*")
        .eq("id", id)
        .single();

    if (atualError || !atual) {
      return NextResponse.json(
        { error: "Atendimento não encontrado." },
        { status: 404 }
      );
    }

    const atualizacoes: Record<string, any> = {};

    if (body.service_type !== undefined) {
      atualizacoes.service_type = String(
        body.service_type
      ).trim();
    }

    if (body.professional !== undefined) {
      atualizacoes.professional = String(
        body.professional
      ).trim();
    }

    if (
      body.date !== undefined &&
      body.time !== undefined
    ) {
      atualizacoes.scheduled_at =
        `${String(body.date).trim()}T${String(
          body.time
        ).trim()}:00-03:00`;
    } else if (body.scheduled_at !== undefined) {
      atualizacoes.scheduled_at =
        body.scheduled_at;
    }

    if (body.duration_minutes !== undefined) {
      atualizacoes.duration_minutes = Number(
        body.duration_minutes
      );
    }

    if (body.status !== undefined) {
      atualizacoes.status = String(
        body.status
      ).trim();
    }

    if (body.notes !== undefined) {
      atualizacoes.notes =
        String(body.notes || "").trim() || null;
    }

    if (body.meet_url !== undefined) {
      atualizacoes.meet_url =
        String(body.meet_url || "").trim() ||
        null;
    }

    if (body.charge_type !== undefined) {
      atualizacoes.charge_type = String(
        body.charge_type
      ).trim();
    }

    if (body.amount !== undefined) {
      atualizacoes.amount =
        body.amount === null ||
        body.amount === ""
          ? null
          : Number(body.amount);
    }

    if (
      body.private_session_notes !== undefined
    ) {
      atualizacoes.private_session_notes =
        String(
          body.private_session_notes || ""
        ).trim() || null;
    }

    if (
      body.evolution_summary !== undefined
    ) {
      atualizacoes.evolution_summary =
        String(
          body.evolution_summary || ""
        ).trim() || null;
    }

    if (body.client_activity !== undefined) {
      atualizacoes.client_activity =
        String(
          body.client_activity || ""
        ).trim() || null;
    }

    if (
      body.published_to_client !== undefined
    ) {
      atualizacoes.published_to_client =
        Boolean(body.published_to_client);
    }

    if (body.completed_at !== undefined) {
      atualizacoes.completed_at =
        body.completed_at || null;
    }

    const agendaMudou =
      atualizacoes.scheduled_at !== undefined ||
      atualizacoes.duration_minutes !== undefined ||
      atualizacoes.professional !== undefined;

    if (agendaMudou) {
      const professional =
        atualizacoes.professional ??
        atual.professional;

      const scheduledAt =
        atualizacoes.scheduled_at ??
        atual.scheduled_at;

      const durationMinutes = Number(
        atualizacoes.duration_minutes ??
        atual.duration_minutes ??
        60
      );

      if (
        await existeConflito({
          professional,
          scheduledAt,
          durationMinutes,
          excludeAppointmentId: id,
        })
      ) {
        return NextResponse.json(
          {
            error:
              "Este horário já está ocupado na Agenda-Mãe. Escolha outro horário.",
          },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from("appointments")
      .update(atualizacoes)
      .eq("id", id)
      .select(CAMPOS)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const dataMudou =
      atualizacoes.scheduled_at !== undefined &&
      String(atual.scheduled_at) !==
        String(atualizacoes.scheduled_at);

    const statusMudou =
      atualizacoes.status !== undefined &&
      String(atual.status) !==
        String(atualizacoes.status);

    let action = "editado";

    if (dataMudou) {
      action = "remarcado";
    }

    if (
      statusMudou &&
      atualizacoes.status === "cancelado"
    ) {
      action = "cancelado";
    }

    if (
      statusMudou &&
      atualizacoes.status === "realizado"
    ) {
      action = "realizado";
    }

    await supabaseAdmin
      .from("appointment_history")
      .insert({
        appointment_id: id,
        action,
        old_scheduled_at:
          atual.scheduled_at || null,
        new_scheduled_at:
          atualizacoes.scheduled_at ||
          atual.scheduled_at ||
          null,
        old_status: atual.status || null,
        new_status:
          atualizacoes.status ||
          atual.status ||
          null,
        details: {
          service_type:
            atualizacoes.service_type,
          professional:
            atualizacoes.professional,
          duration_minutes:
            atualizacoes.duration_minutes,
        },
      });

    return NextResponse.json({
      success: true,
      atendimento: mapearAtendimento(data),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar o atendimento.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  if (!(await autorizarAdmin(request))) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const id =
      request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Atendimento não informado." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("appointments")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao excluir o atendimento.",
      },
      { status: 500 }
    );
  }
}
