import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const PROFESSIONAL = "Ádria Freitas";

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";

  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

async function autorizarAdmin(request: NextRequest) {
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

function normalizarCliente(relacao: any) {
  return Array.isArray(relacao)
    ? relacao[0] || null
    : relacao || null;
}

async function espelhoAtivo() {
  const { data } = await supabaseAdmin
    .from("professional_schedule_settings")
    .select("mirror_club_therapy")
    .eq("professional", PROFESSIONAL)
    .maybeSingle();

  return data?.mirror_club_therapy === true;
}

function inicioComFuso(date: string, time: string) {
  return `${date}T${time}:00-03:00`;
}

export async function GET(request: NextRequest) {
  if (!(await autorizarAdmin(request))) {
    return NextResponse.json(
      { error: "Acesso administrativo não autorizado." },
      { status: 401 }
    );
  }

  try {
    const [
      eventsResult,
      participantsResult,
      clientsResult,
      appointmentsResult,
      settingsResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("club_mentoring_events")
        .select("*")
        .eq("professional", PROFESSIONAL)
        .order("starts_at", { ascending: true }),

      supabaseAdmin
        .from("club_mentoring_participants")
        .select(`
          id,
          event_id,
          client_id,
          response,
          attendance,
          responded_at,
          club_clients (
            nome,
            nome_referencia,
            slug,
            plano
          )
        `),

      supabaseAdmin
        .from("club_clients")
        .select("id, nome, nome_referencia, slug, plano, status")
        .ilike("plano", "diamante")
        .eq("status", "ativo")
        .order("nome", { ascending: true }),

      supabaseAdmin
        .from("appointments")
        .select(`
          id,
          client_id,
          service_type,
          professional,
          scheduled_at,
          duration_minutes,
          status,
          club_clients (
            nome,
            nome_referencia,
            slug
          )
        `)
        .eq("professional", PROFESSIONAL)
        .neq("status", "cancelado")
        .order("scheduled_at", { ascending: true }),

      supabaseAdmin
        .from("professional_schedule_settings")
        .select("*")
        .eq("professional", PROFESSIONAL)
        .maybeSingle(),
    ]);

    if (eventsResult.error) {
      return NextResponse.json(
        { error: eventsResult.error.message },
        { status: 500 }
      );
    }

    const participants = (participantsResult.data || []).map(
      (item: any) => {
        const cliente = normalizarCliente(item.club_clients);

        return {
          id: item.id,
          event_id: item.event_id,
          client_id: item.client_id,
          response: item.response,
          attendance: item.attendance,
          responded_at: item.responded_at,
          client_name:
            cliente?.nome_referencia ||
            cliente?.nome ||
            "Mentorada",
          client_slug: cliente?.slug || "",
        };
      }
    );

    const appointments = (appointmentsResult.data || []).map(
      (item: any) => {
        const cliente = normalizarCliente(item.club_clients);

        return {
          id: item.id,
          client_id: item.client_id,
          client_name:
            cliente?.nome_referencia ||
            cliente?.nome ||
            "Cliente",
          client_slug: cliente?.slug || "",
          service_type: item.service_type,
          scheduled_at: item.scheduled_at,
          duration_minutes: item.duration_minutes,
          status: item.status,
        };
      }
    );

    return NextResponse.json({
      events: eventsResult.data || [],
      participants,
      diamond_clients: clientsResult.data || [],
      appointments,
      settings:
        settingsResult.data || {
          professional: PROFESSIONAL,
          mirror_club_therapy: true,
        },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar agenda de mentorias.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await autorizarAdmin(request))) {
    return NextResponse.json(
      { error: "Acesso administrativo não autorizado." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const action = String(body.action || "").trim();

    if (action === "set_mirror") {
      const mirror = Boolean(body.mirror_club_therapy);

      const { error } = await supabaseAdmin
        .from("professional_schedule_settings")
        .upsert(
          {
            professional: PROFESSIONAL,
            mirror_club_therapy: mirror,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "professional" }
        );

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        mirror_club_therapy: mirror,
      });
    }

    if (action !== "create_events") {
      return NextResponse.json(
        { error: "Ação inválida." },
        { status: 400 }
      );
    }

    const eventType = String(body.event_type || "").trim();

    const dates: string[] = Array.isArray(body.dates)
  ? [
      ...new Set<string>(
        body.dates
          .map((item: unknown) =>
            String(item ?? "").trim()
          )
          .filter((item: string) =>
            /^\d{4}-\d{2}-\d{2}$/.test(item)
          )
      ),
    ]
  : [];

const times: string[] = Array.isArray(body.times)
  ? [
      ...new Set<string>(
        body.times
          .map((item: unknown) =>
            String(item ?? "").trim()
          )
          .filter((item: string) =>
            /^\d{2}:\d{2}$/.test(item)
          )
      ),
    ]
  : [];
  

    const duration = Number(body.duration_minutes || 60);

    const title =
      String(body.title || "").trim() ||
      (eventType === "group"
        ? "Mentoria em Grupo"
        : "Mentoria Individual");

    if (!["individual", "group"].includes(eventType)) {
      return NextResponse.json(
        { error: "Escolha Mentoria Individual ou Em Grupo." },
        { status: 400 }
      );
    }

    if (!dates.length || !times.length) {
      return NextResponse.json(
        { error: "Selecione pelo menos uma data e um horário." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      return NextResponse.json(
        { error: "Duração inválida." },
        { status: 400 }
      );
    }

    const mirror = await espelhoAtivo();
    const created: any[] = [];
    const skipped: any[] = [];

    for (const date of dates) {
      for (const time of times) {
        const startsAt = inicioComFuso(date, time);

        const {
          data: conflict,
          error: conflictError,
        } = await supabaseAdmin.rpc(
          "professional_schedule_has_conflict",
          {
            p_professional: PROFESSIONAL,
            p_starts_at: startsAt,
            p_duration_minutes: duration,
            p_include_appointments: mirror,
            p_include_mentoring: true,
            p_exclude_appointment_id: null,
            p_exclude_mentoring_event_id: null,
          }
        );

        if (conflictError) {
          return NextResponse.json(
            { error: conflictError.message },
            { status: 500 }
          );
        }

        if (conflict) {
          skipped.push({
            date,
            time,
            reason: "Já existe compromisso neste horário.",
          });
          continue;
        }

        const { data, error } = await supabaseAdmin
          .from("club_mentoring_events")
          .insert({
            professional: PROFESSIONAL,
            event_type: eventType,
            title,
            starts_at: startsAt,
            duration_minutes: duration,
            status: "open",
            blocks_schedule: true,
          })
          .select("*")
          .single();

        if (error) {
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }

        created.push(data);
      }
    }

    return NextResponse.json(
      {
        success: true,
        created,
        skipped,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao criar agenda de mentorias.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await autorizarAdmin(request))) {
    return NextResponse.json(
      { error: "Acesso administrativo não autorizado." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const action = String(body.action || "").trim();

    if (action === "attendance") {
      const eventId = String(body.event_id || "").trim();
      const clientId = String(body.client_id || "").trim();
      const attendance = String(body.attendance || "").trim();

      if (
        !eventId ||
        !clientId ||
        !["not_marked", "present", "absent"].includes(attendance)
      ) {
        return NextResponse.json(
          { error: "Dados de presença inválidos." },
          { status: 400 }
        );
      }

      const { data: existing } = await supabaseAdmin
        .from("club_mentoring_participants")
        .select("id")
        .eq("event_id", eventId)
        .eq("client_id", clientId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabaseAdmin
          .from("club_mentoring_participants")
          .update({
            attendance,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) {
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }
      } else {
        const { error } = await supabaseAdmin
          .from("club_mentoring_participants")
          .insert({
            event_id: eventId,
            client_id: clientId,
            response: "pending",
            attendance,
          });

        if (error) {
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({ success: true });
    }

    if (action === "event_status") {
      const eventId = String(body.event_id || "").trim();
      const status = String(body.status || "").trim();

      if (
        !eventId ||
        !["open", "booked", "completed", "cancelled"].includes(status)
      ) {
        return NextResponse.json(
          { error: "Status inválido." },
          { status: 400 }
        );
      }

      const { error } = await supabaseAdmin
        .from("club_mentoring_events")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventId);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
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
            : "Erro ao atualizar mentoria.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await autorizarAdmin(request))) {
    return NextResponse.json(
      { error: "Acesso administrativo não autorizado." },
      { status: 401 }
    );
  }

  const id = String(
    request.nextUrl.searchParams.get("id") || ""
  ).trim();

  if (!id) {
    return NextResponse.json(
      { error: "Mentoria não informada." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("club_mentoring_events")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
