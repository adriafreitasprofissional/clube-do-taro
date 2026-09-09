import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

function bearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization") || "";

  return authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : "";
}

async function autorizarAdmin(
  request: NextRequest
) {
  const token = bearerToken(request);

  if (!token) return false;

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);

  if (!user?.email) return false;

  const { data: admin } =
    await supabaseAdmin
      .from("club_clients")
      .select("id")
      .ilike("email", user.email)
      .eq("role", "admin")
      .maybeSingle();

  return Boolean(admin);
}

/* =========================================================
   LISTAR PALESTRAS INDICADAS PARA UM PACIENTE
========================================================= */

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

  const clientId =
    request.nextUrl.searchParams
      .get("client_id")
      ?.trim();

  if (!clientId) {
    return NextResponse.json(
      {
        error:
          "Paciente não informado.",
      },
      { status: 400 }
    );
  }

  const { data, error } =
    await supabaseAdmin
      .from(
        "therapy_lecture_assignments"
      )
      .select(`
        id,
        lecture_id,
        client_id,
        professional_id,
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
      .eq("client_id", clientId)
      .order("assigned_at", {
        ascending: false,
      });

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    indicacoes: data || [],
  });
}

/* =========================================================
   INDICAR PALESTRA
========================================================= */

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
    const body =
      await request.json();

    const lectureId =
      String(
        body.lecture_id || ""
      ).trim();

    const clientId =
      String(
        body.client_id || ""
      ).trim();

    const appointmentId =
      body.appointment_id
        ? String(
            body.appointment_id
          ).trim()
        : null;

    const sessionDate =
      body.session_date
        ? String(
            body.session_date
          ).trim()
        : null;

    if (!lectureId) {
      return NextResponse.json(
        {
          error:
            "Selecione uma mini palestra.",
        },
        { status: 400 }
      );
    }

    if (!clientId) {
      return NextResponse.json(
        {
          error:
            "Paciente não informado.",
        },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       Busca a palestra
    --------------------------------------------- */

    const {
      data: palestra,
      error: palestraError,
    } =
      await supabaseAdmin
        .from("therapy_lectures")
        .select(`
          id,
          professional_id,
          title,
          active
        `)
        .eq("id", lectureId)
        .maybeSingle();

    if (palestraError) {
      return NextResponse.json(
        {
          error:
            palestraError.message,
        },
        { status: 500 }
      );
    }

    if (!palestra) {
      return NextResponse.json(
        {
          error:
            "Mini palestra não encontrada.",
        },
        { status: 404 }
      );
    }

    if (!palestra.active) {
      return NextResponse.json(
        {
          error:
            "Esta mini palestra está desativada.",
        },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       Evita indicação duplicada
       na mesma sessão
    --------------------------------------------- */

    let consultaDuplicada =
      supabaseAdmin
        .from(
          "therapy_lecture_assignments"
        )
        .select("id")
        .eq(
          "lecture_id",
          lectureId
        )
        .eq(
          "client_id",
          clientId
        );

    if (appointmentId) {
      consultaDuplicada =
        consultaDuplicada.eq(
          "appointment_id",
          appointmentId
        );
    } else if (sessionDate) {
      consultaDuplicada =
        consultaDuplicada.eq(
          "session_date",
          sessionDate
        );
    }

    const {
      data: jaExiste,
      error: duplicadaError,
    } =
      await consultaDuplicada
        .limit(1)
        .maybeSingle();

    if (duplicadaError) {
      return NextResponse.json(
        {
          error:
            duplicadaError.message,
        },
        { status: 500 }
      );
    }

    if (jaExiste) {
      return NextResponse.json(
        {
          error:
            "Esta palestra já foi indicada para esta sessão.",
        },
        { status: 409 }
      );
    }

    /* ---------------------------------------------
       Grava indicação
    --------------------------------------------- */

    const { data, error } =
      await supabaseAdmin
        .from(
          "therapy_lecture_assignments"
        )
        .insert({
          lecture_id:
            lectureId,

          client_id:
            clientId,

          professional_id:
            palestra.professional_id,

          appointment_id:
            appointmentId,

          session_date:
            sessionDate,

          therapist_note:
            String(
              body.therapist_note ||
                ""
            ).trim() || null,

          featured:
            body.featured ===
              undefined
              ? true
              : Boolean(
                  body.featured
                ),
        })
        .select(`
          id,
          lecture_id,
          client_id,
          professional_id,
          appointment_id,
          session_date,
          therapist_note,
          featured,
          assigned_at
        `)
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
        indicacao: data,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao indicar mini palestra.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   REMOVER INDICAÇÃO

   Remove apenas o vínculo com a sessão/paciente.
   NÃO apaga a palestra da biblioteca.
========================================================= */

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

  const id =
    request.nextUrl.searchParams
      .get("id")
      ?.trim();

  if (!id) {
    return NextResponse.json(
      {
        error:
          "Indicação não informada.",
      },
      { status: 400 }
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        "therapy_lecture_assignments"
      )
      .delete()
      .eq("id", id);

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}