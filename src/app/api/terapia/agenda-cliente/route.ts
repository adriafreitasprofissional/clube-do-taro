import {
  NextRequest,
  NextResponse,
} from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function normalizarCliente(
  relacao: any
) {
  if (Array.isArray(relacao)) {
    return relacao[0] || null;
  }

  return relacao || null;
}

async function buscarAcesso(
  token: string
) {
  const { data, error } =
    await supabaseAdmin
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
    new Date(
      data.expires_at
    ).getTime() < Date.now()
  ) {
    return null;
  }

  const cliente =
    normalizarCliente(
      data.club_clients
    );

  if (!cliente) {
    return null;
  }

  return {
    ...data,
    cliente,
  };
}

function dataSaoPaulo(
  iso: string
) {
  const partes =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).formatToParts(
      new Date(iso)
    );

  const mapa =
    Object.fromEntries(
      partes.map((item) => [
        item.type,
        item.value,
      ])
    );

  return `${mapa.year}-${mapa.month}-${mapa.day}`;
}

function horarioSaoPaulo(
  iso: string
) {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      timeZone:
        "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).format(
    new Date(iso)
  );
}

function gerarCandidatos() {
  const horarios: string[] = [];

  // A Agenda-Mãe decide quais destes horários
  // estão realmente livres ou bloqueados.
  // Usamos intervalos de 30 minutos para não
  // limitar o profissional a horários fixos.
  for (
    let minutos = 7 * 60;
    minutos <= 22 * 60;
    minutos += 30
  ) {
    const hora =
      String(
        Math.floor(
          minutos / 60
        )
      ).padStart(2, "0");

    const minuto =
      String(
        minutos % 60
      ).padStart(2, "0");

    horarios.push(
      `${hora}:${minuto}`
    );
  }

  return horarios;
}

async function temConflito({
  professional,
  scheduledAt,
  durationMinutes,
  appointmentId,
}: {
  professional: string;
  scheduledAt: string;
  durationMinutes: number;
  appointmentId: string;
}) {
  const {
    data: settings,
  } = await supabaseAdmin
    .from(
      "professional_schedule_settings"
    )
    .select(
      "mirror_club_therapy"
    )
    .eq(
      "professional",
      professional
    )
    .maybeSingle();

  const mirror =
    settings
      ?.mirror_club_therapy === true;

  const { data, error } =
    await supabaseAdmin.rpc(
      "professional_schedule_has_conflict",
      {
        p_professional:
          professional,
        p_starts_at:
          scheduledAt,
        p_duration_minutes:
          durationMinutes,
        p_include_appointments:
          true,
        p_include_mentoring:
          mirror,
        p_exclude_appointment_id:
          appointmentId,
        p_exclude_mentoring_event_id:
          null,
      }
    );

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data === true;
}

async function buscarAtendimento(
  appointmentId: string,
  clientId: string
) {
  const { data, error } =
    await supabaseAdmin
      .from("appointments")
      .select(`
        id,
        client_id,
        service_type,
        professional,
        scheduled_at,
        duration_minutes,
        status,
        meet_url
      `)
      .eq("id", appointmentId)
      .eq("client_id", clientId)
      .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function GET(
  request: NextRequest
) {
  try {
    const token = String(
      request.nextUrl.searchParams.get(
        "token"
      ) || ""
    ).trim();

    const appointmentId =
      String(
        request.nextUrl.searchParams.get(
          "appointmentId"
        ) || ""
      ).trim();

    if (
      !token ||
      !appointmentId
    ) {
      return NextResponse.json(
        {
          error:
            "Acesso ou sessão não informados.",
        },
        { status: 400 }
      );
    }

    const acesso =
      await buscarAcesso(
        token
      );

    if (!acesso) {
      return NextResponse.json(
        {
          error:
            "Este acesso não é válido ou expirou.",
        },
        { status: 401 }
      );
    }

    const atendimento =
      await buscarAtendimento(
        appointmentId,
        acesso.client_id
      );

    if (
      !atendimento ||
      atendimento.status ===
        "cancelado"
    ) {
      return NextResponse.json(
        {
          error:
            "Sessão não encontrada.",
        },
        { status: 404 }
      );
    }

    const data =
      dataSaoPaulo(
        atendimento.scheduled_at
      );

    const horarioAtual =
      horarioSaoPaulo(
        atendimento.scheduled_at
      );

    const candidatos =
      gerarCandidatos();

    const horarios: string[] =
      [];

    for (
      const horario of candidatos
    ) {
      if (
        horario === horarioAtual
      ) {
        continue;
      }

      const scheduledAt =
        `${data}T${horario}:00-03:00`;

      if (
        new Date(
          scheduledAt
        ).getTime() <= Date.now()
      ) {
        continue;
      }

      const conflito =
        await temConflito({
          professional:
            atendimento.professional,
          scheduledAt,
          durationMinutes:
            Number(
              atendimento.duration_minutes ||
                60
            ),
          appointmentId:
            atendimento.id,
        });

      if (!conflito) {
        horarios.push(
          horario
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        data,
        horarios,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (
    error: unknown
  ) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao consultar horários.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const token =
      String(
        body.token || ""
      ).trim();

    const appointmentId =
      String(
        body.appointmentId ||
          ""
      ).trim();

    const action =
      String(
        body.action || ""
      ).trim();

    if (
      !token ||
      !appointmentId
    ) {
      return NextResponse.json(
        {
          error:
            "Acesso ou sessão não informados.",
        },
        { status: 400 }
      );
    }

    const acesso =
      await buscarAcesso(
        token
      );

    if (!acesso) {
      return NextResponse.json(
        {
          error:
            "Este acesso não é válido ou expirou.",
        },
        { status: 401 }
      );
    }

    const atendimento =
      await buscarAtendimento(
        appointmentId,
        acesso.client_id
      );

    if (!atendimento) {
      return NextResponse.json(
        {
          error:
            "Sessão não encontrada.",
        },
        { status: 404 }
      );
    }

    if (action === "cancel") {
      if (
        atendimento.status ===
        "cancelado"
      ) {
        return NextResponse.json(
          {
            error:
              "Esta sessão já foi cancelada.",
          },
          { status: 409 }
        );
      }

      const { error } =
        await supabaseAdmin
          .from("appointments")
          .update({
            status:
              "cancelado",
          })
          .eq(
            "id",
            atendimento.id
          )
          .eq(
            "client_id",
            acesso.client_id
          );

      if (error) {
        throw error;
      }

      await supabaseAdmin
        .from(
          "appointment_history"
        )
        .insert({
          appointment_id:
            atendimento.id,
          action:
            "cancelado_pela_cliente",
          old_scheduled_at:
            atendimento.scheduled_at,
          new_scheduled_at:
            atendimento.scheduled_at,
          old_status:
            atendimento.status,
          new_status:
            "cancelado",
          details: {
            origem:
              "portal_cliente",
          },
        });

      return NextResponse.json({
        success: true,
        message:
          "Sessão cancelada.",
      });
    }

    if (
      action === "reschedule"
    ) {
      const time =
        String(
          body.time || ""
        ).trim();

      if (
        !/^\d{2}:\d{2}$/.test(
          time
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Horário inválido.",
          },
          { status: 400 }
        );
      }

      const data =
        dataSaoPaulo(
          atendimento.scheduled_at
        );

      const novoHorario =
        `${data}T${time}:00-03:00`;

      if (
        new Date(
          novoHorario
        ).getTime() <= Date.now()
      ) {
        return NextResponse.json(
          {
            error:
              "Escolha um horário futuro.",
          },
          { status: 400 }
        );
      }

      const conflito =
        await temConflito({
          professional:
            atendimento.professional,
          scheduledAt:
            novoHorario,
          durationMinutes:
            Number(
              atendimento.duration_minutes ||
                60
            ),
          appointmentId:
            atendimento.id,
        });

      if (conflito) {
        return NextResponse.json(
          {
            error:
              "Este horário não está mais disponível. Escolha outro.",
          },
          { status: 409 }
        );
      }

      const { error } =
        await supabaseAdmin
          .from("appointments")
          .update({
            scheduled_at:
              novoHorario,
            status:
              "agendado",
          })
          .eq(
            "id",
            atendimento.id
          )
          .eq(
            "client_id",
            acesso.client_id
          );

      if (error) {
        throw error;
      }

      await supabaseAdmin
        .from(
          "appointment_history"
        )
        .insert({
          appointment_id:
            atendimento.id,
          action:
            "remarcado_pela_cliente",
          old_scheduled_at:
            atendimento.scheduled_at,
          new_scheduled_at:
            novoHorario,
          old_status:
            atendimento.status,
          new_status:
            "agendado",
          details: {
            origem:
              "portal_cliente",
          },
        });

      return NextResponse.json({
        success: true,
        message:
          "Horário alterado com sucesso.",
      });
    }

    return NextResponse.json(
      {
        error:
          "Ação inválida.",
      },
      { status: 400 }
    );
  } catch (
    error: unknown
  ) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar a sessão.",
      },
      { status: 500 }
    );
  }
}
