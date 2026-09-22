import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTherapyAdmin } from "@/app/api/terapia/admin/_auth";

function limparToken(valor: unknown) {
  return String(valor || "").trim();
}

async function resolverPaciente(
  request: NextRequest,
  token: string
) {
  const preview =
    token.startsWith("preview-");

  if (preview) {
    const clientId =
      token.replace(
        /^preview-/,
        ""
      );

    const admin =
      await getTherapyAdmin(
        request
      );

    if (!admin || !clientId) {
      return null;
    }

    let query =
      supabaseAdmin
        .from(
          "therapy_client_access"
        )
        .select(
          "client_id, professional, active, expires_at"
        )
        .eq(
          "client_id",
          clientId
        )
        .eq(
          "active",
          true
        );

    if (
      !admin.central_access
    ) {
      query =
        query.eq(
          "professional",
          admin.professional
        );
    }

    const {
      data: acesso,
      error,
    } = await query
      .maybeSingle();

    if (
      error ||
      !acesso
    ) {
      return null;
    }

    return {
      clientId:
        acesso.client_id,
      professional:
        acesso.professional,
      preview: true,
    };
  }

  const {
    data: acesso,
    error,
  } = await supabaseAdmin
    .from(
      "therapy_client_access"
    )
    .select(
      "client_id, professional, active, expires_at"
    )
    .eq(
      "access_token",
      token
    )
    .eq(
      "active",
      true
    )
    .maybeSingle();

  if (
    error ||
    !acesso
  ) {
    return null;
  }

  if (
    acesso.expires_at &&
    new Date(
      acesso.expires_at
    ).getTime() <
      Date.now()
  ) {
    return null;
  }

  return {
    clientId:
      acesso.client_id,
    professional:
      acesso.professional,
    preview: false,
  };
}

export async function GET(
  request: NextRequest
) {
  try {
    const token =
      limparToken(
        request.nextUrl
          .searchParams
          .get("token")
      );

    const quizId =
      limparToken(
        request.nextUrl
          .searchParams
          .get("quizId")
      );

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Acesso não informado.",
        },
        { status: 400 }
      );
    }

    const paciente =
      await resolverPaciente(
        request,
        token
      );

    if (!paciente) {
      return NextResponse.json(
        {
          error:
            "Paciente não encontrada ou acesso expirado.",
        },
        { status: 401 }
      );
    }

    let quizQuery =
      supabaseAdmin
        .from(
          "therapy_quizzes"
        )
        .select(`
          id,
          client_id,
          professional_id,
          appointment_id,
          title,
          subtitle,
          instructions,
          questions,
          status,
          quiz_type,
          published_at,
          created_at,
          updated_at
        `)
        .eq(
          "client_id",
          paciente.clientId
        )
        .eq(
          "status",
          "published"
        )
        .order(
          "published_at",
          {
            ascending: false,
          }
        );

    if (quizId) {
      quizQuery =
        quizQuery.eq(
          "id",
          quizId
        );
    }

    const {
      data: quizzes,
      error: quizError,
    } = await quizQuery;

    if (quizError) {
      throw quizError;
    }

    const ids =
      (quizzes || []).map(
        (quiz: any) =>
          quiz.id
      );

    let respostas: any[] =
      [];

    if (ids.length) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from(
          "therapy_quiz_responses"
        )
        .select(`
          id,
          quiz_id,
          client_id,
          answers,
          status,
          started_at,
          submitted_at
        `)
        .eq(
          "client_id",
          paciente.clientId
        )
        .in(
          "quiz_id",
          ids
        );

      if (error) {
        throw error;
      }

      respostas =
        data || [];
    }

    const porQuiz =
      new Map(
        respostas.map(
          (item: any) => [
            item.quiz_id,
            item,
          ]
        )
      );

    const resultado =
      (quizzes || []).map(
        (quiz: any) => ({
          ...quiz,
          resposta:
            porQuiz.get(
              quiz.id
            ) || null,
        })
      );

    return NextResponse.json({
      preview:
        paciente.preview,
      quizzes:
        resultado,
      quiz:
        quizId
          ? resultado[0] ||
            null
          : undefined,
    });
  } catch (
    error: unknown
  ) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar atividades.",
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
      limparToken(
        body.token
      );

    const quizId =
      limparToken(
        body.quiz_id
      );

    const action =
      limparToken(
        body.action
      ) || "save";

    const answers =
      body.answers &&
      typeof body.answers ===
        "object"
        ? body.answers
        : {};

    if (
      !token ||
      !quizId
    ) {
      return NextResponse.json(
        {
          error:
            "Atividade ou acesso não informado.",
        },
        { status: 400 }
      );
    }

    const paciente =
      await resolverPaciente(
        request,
        token
      );

    if (!paciente) {
      return NextResponse.json(
        {
          error:
            "Paciente não encontrada ou acesso expirado.",
        },
        { status: 401 }
      );
    }

    if (
      paciente.preview
    ) {
      return NextResponse.json(
        {
          error:
            "A visualização administrativa não salva respostas.",
        },
        { status: 403 }
      );
    }

    const {
      data: quiz,
      error: quizError,
    } = await supabaseAdmin
      .from(
        "therapy_quizzes"
      )
      .select(
        "id, client_id, status"
      )
      .eq(
        "id",
        quizId
      )
      .eq(
        "client_id",
        paciente.clientId
      )
      .eq(
        "status",
        "published"
      )
      .maybeSingle();

    if (
      quizError ||
      !quiz
    ) {
      return NextResponse.json(
        {
          error:
            "Atividade não encontrada.",
        },
        { status: 404 }
      );
    }

    const {
      data: atual,
    } = await supabaseAdmin
      .from(
        "therapy_quiz_responses"
      )
      .select(
        "id, started_at, submitted_at, status"
      )
      .eq(
        "quiz_id",
        quizId
      )
      .eq(
        "client_id",
        paciente.clientId
      )
      .maybeSingle();

    if (
      atual?.status ===
      "submitted"
    ) {
      return NextResponse.json(
        {
          error:
            "Esta atividade já foi finalizada.",
        },
        { status: 409 }
      );
    }

    const agora =
      new Date()
        .toISOString();

    const finalizar =
      action ===
      "submit";

    const payload = {
      quiz_id:
        quizId,
      client_id:
        paciente.clientId,
      answers,
      status:
        finalizar
          ? "submitted"
          : "in_progress",
      started_at:
        atual?.started_at ||
        agora,
      submitted_at:
        finalizar
          ? agora
          : null,
    };

    const {
      data: resposta,
      error,
    } = await supabaseAdmin
      .from(
        "therapy_quiz_responses"
      )
      .upsert(
        payload,
        {
          onConflict:
            "quiz_id,client_id",
        }
      )
      .select(`
        id,
        quiz_id,
        client_id,
        answers,
        status,
        started_at,
        submitted_at
      `)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      resposta,
    });
  } catch (
    error: unknown
  ) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao salvar atividade.",
      },
      { status: 500 }
    );
  }
}