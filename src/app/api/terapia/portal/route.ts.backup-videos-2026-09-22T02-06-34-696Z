import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function tokenValido(valor: string | null) {
  return String(valor || "").trim();
}

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
    const token = tokenValido(
      request.nextUrl.searchParams.get("token")
    );

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

    const cliente = normalizarCliente(
      acesso.club_clients
    );

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrada." },
        { status: 404 }
      );
    }

    const agora = new Date().toISOString();

    const {
      data: proximoAtendimento,
      error: agendaError,
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
      .eq("client_id", acesso.client_id)
      .neq("status", "cancelado")
      .gte("scheduled_at", agora)
      .order("scheduled_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

    if (agendaError) {
      console.error(
        "Erro ao carregar próximo atendimento:",
        agendaError
      );
    }
const {
  data: jornada,
  error: jornadaError,
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
  .eq("client_id", acesso.client_id)
  .eq("published_to_client", true)
  .order("scheduled_at", {
    ascending: false,
  });

if (jornadaError) {
  console.error(
    "Erro ao carregar jornada:",
    jornadaError
  );
}
    const {
      data: indicacoesPalestras,
      error: palestrasError,
    } = await supabaseAdmin
      .from("therapy_lecture_assignments")
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
      .eq("client_id", acesso.client_id)
      .order("assigned_at", {
        ascending: false,
      });

    if (palestrasError) {
      console.error(
        "Erro ao carregar mini palestras:",
        palestrasError
      );
    }

    const miniPalestras = (
      indicacoesPalestras || []
    ).filter((item: any) => {
      const palestra = Array.isArray(
        item.therapy_lectures
      )
        ? item.therapy_lectures[0]
        : item.therapy_lectures;

      return (
        palestra &&
        palestra.active === true &&
        palestra.visibility !== "private"
      );
    });


    const {
      data: anamnese,
      error: anamneseError,
    } = await supabaseAdmin

      .from("therapy_anamneses")
      .select("id, status, submitted_at")
      .eq("client_id", acesso.client_id)
      .eq("therapy_type", "Terapia TRG")
      .order("submitted_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (anamneseError) {
      console.error(
        "Erro ao carregar anamnese:",
        anamneseError
      );
    }

    return NextResponse.json(
      {
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

        professional:
          acesso.professional,

        proximo_atendimento:
          proximoAtendimento || null,

                jornada: jornada || [],

        mini_palestras:
          miniPalestras,

        anamnese: anamnese
          ? {
              preenchida:
                anamnese.status === "enviada" ||
                anamnese.status === "revisada",
              status:
                anamnese.status,
              submitted_at:
                anamnese.submitted_at,
            }
          : {
              preenchida: false,
              status: null,
              submitted_at: null,
            },
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
            : "Erro ao carregar seu espaço.",
      },
      { status: 500 }
    );
  }
}
