import {
  NextRequest,
  NextResponse,
} from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTherapyAdmin } from "../_auth";

function rel(
  item: any
) {
  return Array.isArray(item)
    ? item[0] || null
    : item || null;
}

async function clientePertenceAoProfissional(
  clientId: string,
  professional: string
) {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from(
      "therapy_client_access"
    )
    .select("client_id")
    .eq(
      "client_id",
      clientId
    )
    .eq(
      "professional",
      professional
    )
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

async function espelhoAtivo(
  professional: string
) {
  const { data } =
    await supabaseAdmin
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

  return (
    data?.mirror_club_therapy ===
    true
  );
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
  const mirror =
    await espelhoAtivo(
      professional
    );

  const {
    data,
    error,
  } = await supabaseAdmin.rpc(
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
        excludeAppointmentId,
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

function mapear(
  item: any
) {
  const cliente =
    rel(
      item.club_clients
    );

  return {
    id: item.id,
    client_id:
      item.client_id,
    client_name:
      cliente?.nome_referencia ||
      cliente?.nome ||
      "Cliente",
    service_type:
      item.service_type,
    professional:
      item.professional,
    scheduled_at:
      item.scheduled_at,
    duration_minutes:
      item.duration_minutes,
    status:
      item.status,
    meet_url:
      item.meet_url,
    charge_type:
      item.charge_type,
    amount:
      item.amount,
  };
}

const CAMPOS = `
  id,
  client_id,
  service_type,
  professional,
  scheduled_at,
  duration_minutes,
  status,
  meet_url,
  charge_type,
  amount,
  club_clients (
    nome,
    nome_referencia
  )
`;

export async function GET(
  request: NextRequest
) {
  const admin =
    await getTherapyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Acesso não autorizado.",
      },
      { status: 401 }
    );
  }

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("appointments")
    .select(CAMPOS)
    .eq(
      "professional",
      admin.professional
    )
    .order(
      "scheduled_at",
      {
        ascending: true,
      }
    );

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    atendimentos:
      (data || []).map(
        mapear
      ),
  });
}

export async function POST(
  request: NextRequest
) {
  const admin =
    await getTherapyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Acesso não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const body =
      await request.json();

    const clientId =
      String(
        body.client_id || ""
      ).trim();

    const serviceType =
      String(
        body.service_type ||
          "Terapia TRG"
      ).trim();

    const date =
      String(
        body.date || ""
      ).trim();

    const time =
      String(
        body.time || ""
      ).trim();

    const durationMinutes =
      Number(
        body.duration_minutes ||
          60
      );

    const meetUrl =
      String(
        body.meet_url || ""
      ).trim() ||
      null;

    const chargeType =
      String(
        body.charge_type ||
          "incluido_pacote"
      ).trim();

    const amount =
      body.amount ===
        null ||
      body.amount ===
        undefined ||
      body.amount === ""
        ? null
        : Number(
            body.amount
          );

    if (
      !clientId ||
      !date ||
      !time
    ) {
      return NextResponse.json(
        {
          error:
            "Paciente, data e horário são obrigatórios.",
        },
        { status: 400 }
      );
    }

    if (
      !(await clientePertenceAoProfissional(
        clientId,
        admin.professional
      ))
    ) {
      return NextResponse.json(
        {
          error:
            "Paciente não vinculada a este profissional.",
        },
        { status: 403 }
      );
    }

    const scheduledAt =
      `${date}T${time}:00-03:00`;

    if (
      await existeConflito({
        professional:
          admin.professional,
        scheduledAt,
        durationMinutes,
      })
    ) {
      return NextResponse.json(
        {
          error:
            "Este horário já está ocupado. Escolha outro.",
        },
        { status: 409 }
      );
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("appointments")
      .insert({
        client_id:
          clientId,
        service_type:
          serviceType,
        professional:
          admin.professional,
        scheduled_at:
          scheduledAt,
        duration_minutes:
          durationMinutes,
        status:
          "agendado",
        meet_url:
          meetUrl,
        charge_type:
          chargeType,
        amount,
      })
      .select(CAMPOS)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        atendimento:
          mapear(data),
      },
      { status: 201 }
    );
  } catch (
    error: unknown
  ) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao criar atendimento.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest
) {
  const admin =
    await getTherapyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Acesso não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const body =
      await request.json();

    const id =
      String(
        body.id || ""
      ).trim();

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Sessão não informada.",
        },
        { status: 400 }
      );
    }

    const {
      data: atual,
      error:
        atualError,
    } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .eq("id", id)
      .eq(
        "professional",
        admin.professional
      )
      .maybeSingle();

    if (
      atualError ||
      !atual
    ) {
      return NextResponse.json(
        {
          error:
            "Sessão não encontrada.",
        },
        { status: 404 }
      );
    }

    const atualizacoes:
      Record<string, any> =
      {};

    if (
      body.status !==
      undefined
    ) {
      atualizacoes.status =
        String(
          body.status
        ).trim();
    }

    if (
      body.service_type !==
      undefined
    ) {
      atualizacoes.service_type =
        String(
          body.service_type
        ).trim();
    }

    if (
      body.meet_url !==
      undefined
    ) {
      atualizacoes.meet_url =
        String(
          body.meet_url || ""
        ).trim() ||
        null;
    }

    if (
      body.charge_type !==
      undefined
    ) {
      atualizacoes.charge_type =
        String(
          body.charge_type
        ).trim();
    }

    if (
      body.amount !==
      undefined
    ) {
      atualizacoes.amount =
        body.amount ===
          null ||
        body.amount === ""
          ? null
          : Number(
              body.amount
            );
    }

    if (
      body.date !==
        undefined &&
      body.time !==
        undefined
    ) {
      atualizacoes.scheduled_at =
        `${String(
          body.date
        ).trim()}T${String(
          body.time
        ).trim()}:00-03:00`;
    }

    if (
      body.duration_minutes !==
      undefined
    ) {
      atualizacoes.duration_minutes =
        Number(
          body.duration_minutes
        );
    }

    const agendaMudou =
      atualizacoes.scheduled_at !==
        undefined ||
      atualizacoes.duration_minutes !==
        undefined;

    if (agendaMudou) {
      const conflito =
        await existeConflito({
          professional:
            admin.professional,
          scheduledAt:
            atualizacoes.scheduled_at ??
            atual.scheduled_at,
          durationMinutes:
            Number(
              atualizacoes.duration_minutes ??
                atual.duration_minutes ??
                60
            ),
          excludeAppointmentId:
            id,
        });

      if (conflito) {
        return NextResponse.json(
          {
            error:
              "Este horário já está ocupado. Escolha outro.",
          },
          { status: 409 }
        );
      }
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("appointments")
      .update(
        atualizacoes
      )
      .eq("id", id)
      .eq(
        "professional",
        admin.professional
      )
      .select(CAMPOS)
      .single();

    if (error) {
      throw error;
    }

    let action =
      "editado";

    if (
      atualizacoes.scheduled_at
    ) {
      action =
        "remarcado";
    }

    if (
      atualizacoes.status ===
      "cancelado"
    ) {
      action =
        "cancelado";
    }

    if (
      atualizacoes.status ===
      "realizado"
    ) {
      action =
        "realizado";
    }

    await supabaseAdmin
      .from(
        "appointment_history"
      )
      .insert({
        appointment_id:
          id,
        action,
        old_scheduled_at:
          atual.scheduled_at ||
          null,
        new_scheduled_at:
          atualizacoes.scheduled_at ||
          atual.scheduled_at ||
          null,
        old_status:
          atual.status || null,
        new_status:
          atualizacoes.status ||
          atual.status ||
          null,
        details: {
          origem:
            "terapia_admin_profissional",
        },
      });

    return NextResponse.json({
      success: true,
      atendimento:
        mapear(data),
    });
  } catch (
    error: unknown
  ) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar sessão.",
      },
      { status: 500 }
    );
  }
}
