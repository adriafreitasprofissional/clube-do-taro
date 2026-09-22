import {
  NextRequest,
  NextResponse,
} from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTherapyAdmin } from "../_auth";

function normalizarCliente(
  relacao: any
) {
  if (
    Array.isArray(relacao)
  ) {
    return (
      relacao[0] || null
    );
  }

  return relacao || null;
}

export async function GET(
  request: NextRequest
) {
  const admin =
    await getTherapyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Acesso nÃƒÂ£o autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const clientId =
      String(
        request.nextUrl.searchParams.get(
          "clientId"
        ) || ""
      ).trim();

    if (!clientId) {
      return NextResponse.json(
        {
          error:
            "Paciente nÃƒÂ£o informada.",
        },
        { status: 400 }
      );
    }

    let acessoQuery =
      supabaseAdmin
        .from(
          "therapy_client_access"
        )
        .select(`
          client_id,
          professional,
          active,
          club_clients (
            id,
            nome,
            nome_referencia,
            email,
            slug
          )
        `)
        .eq(
          "client_id",
          clientId
        )
        .eq("active", true);

    if (!admin.central_access) {
      acessoQuery =
        acessoQuery.eq(
          "professional",
          admin.professional
        );
    }

    const {
      data: acesso,
      error: acessoError,
    } = await acessoQuery
      .maybeSingle();

    if (
      acessoError ||
      !acesso
    ) {
      return NextResponse.json(
        {
          error:
            "Paciente nÃƒÂ£o encontrada.",
        },
        { status: 404 }
      );
    }

    const professionalPaciente =
      acesso.professional ||
      admin.professional;

    const cliente =
      normalizarCliente(
        acesso.club_clients
      );

    if (!cliente) {
      return NextResponse.json(
        {
          error:
            "Cadastro da paciente nÃƒÂ£o encontrado.",
        },
        { status: 404 }
      );
    }

    const agora =
      new Date().toISOString();

    const {
      data: proximoAtendimento,
    } = await supabaseAdmin
      .from("appointments")
      .select(`
        id,
        service_type,
        professional,
        scheduled_at,
        duration_minutes,
        status,
        meet_url
      `)
      .eq(
        "client_id",
        clientId
      )
      .eq(
        "professional",
        professionalPaciente
      )
      .neq(
        "status",
        "cancelado"
      )
      .gte(
        "scheduled_at",
        agora
      )
      .order(
        "scheduled_at",
        {
          ascending: true,
        }
      )
      .limit(1)
      .maybeSingle();

    const {
      data: jornada,
    } = await supabaseAdmin
      .from("appointments")
      .select(`
        id,
        service_type,
        scheduled_at,
        session_title,
        recording_url,
        client_report,
        client_activity,
        published_to_client,
        completed_at
      `)
      .eq(
        "client_id",
        clientId
      )
      .eq(
        "professional",
        professionalPaciente
      )
      .eq(
        "published_to_client",
        true
      )
      .order(
        "scheduled_at",
        {
          ascending: false,
        }
      );

    const {
      data: indicacoesPalestras,
    } = await supabaseAdmin
      .from(
        "therapy_lecture_assignments"
      )
      .select(`
        id,
        lecture_id,
        appointment_id,
        session_date,
        therapist_note,
        featured,
        assigned_at,
        therapy_lectures (
          id,
          title,
          subtitle,
          description,
          category,
          video_url,
          cover_url,
          duration_minutes,
          visibility,
          active
        )
      `)
      .eq(
        "client_id",
        clientId
      )
      .order(
        "assigned_at",
        {
          ascending: false,
        }
      );

    const miniPalestras = (
      indicacoesPalestras ||
      []
    ).filter((item: any) => {
      const palestra =
        Array.isArray(
          item.therapy_lectures
        )
          ? item
              .therapy_lectures[0]
          : item
              .therapy_lectures;

      return (
        palestra &&
        palestra.active ===
          true &&
        palestra.visibility !==
          "private"
      );
    });

    const {
      data: anamnese,
    } = await supabaseAdmin
      .from(
        "therapy_anamneses"
      )
      .select(
        "id, status, submitted_at"
      )
      .eq(
        "client_id",
        clientId
      )
      .eq(
        "therapy_type",
        "Terapia TRG"
      )
      .order(
        "submitted_at",
        {
          ascending: false,
        }
      )
      .limit(1)
      .maybeSingle();

    return NextResponse.json(
      {
        preview: true,

        cliente: {
          id:
            cliente.id,
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

        professional:
          acesso.professional,

        proximo_atendimento:
          proximoAtendimento ||
          null,

        jornada:
          jornada || [],

        mini_palestras:
          miniPalestras,

        anamnese:
          anamnese
            ? {
                preenchida:
                  anamnese.status ===
                    "enviada" ||
                  anamnese.status ===
                    "revisada",
                status:
                  anamnese.status,
                submitted_at:
                  anamnese.submitted_at,
              }
            : {
                preenchida:
                  false,
                status: null,
                submitted_at:
                  null,
              },
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
            : "Erro ao visualizar paciente.",
      },
      { status: 500 }
    );
  }
}

