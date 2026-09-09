import {
  NextRequest,
  NextResponse,
} from "next/server";

import { randomUUID } from "crypto";

import { supabaseAdmin } from "@/lib/supabase-admin";

type TipoPergunta =
  | "single_choice"
  | "multiple_choice"
  | "short_text"
  | "long_text"
  | "scale";

type PerguntaQuiz = {
  id?: string;
  type?: TipoPergunta;
  prompt?: string;
  helper?: string | null;
  options?: string[];
  min?: number;
  max?: number;
  min_label?: string | null;
  max_label?: string | null;
  required?: boolean;
  allow_skip?: boolean;
  allow_stop?: boolean;
};

const TEXTO_SEGURANCA =
  "No momento não consigo responder isso — e tudo bem.";

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

  if (!token) {
    return false;
  }

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);

  if (!user?.email) {
    return false;
  }

  const { data: admin } =
    await supabaseAdmin
      .from("club_clients")
      .select("id")
      .ilike("email", user.email)
      .eq("role", "admin")
      .maybeSingle();

  return Boolean(admin);
}

async function profissionalPadrao() {
  const { data, error } =
    await supabaseAdmin
      .from("therapy_professionals")
      .select("id, name, slug")
      .eq("slug", "adria-freitas")
      .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error(
      "Profissional Ádria Freitas não encontrada."
    );
  }

  return data;
}

async function resolverProfissional(
  valor?: unknown
) {
  const professionalId =
    String(valor || "").trim();

  if (professionalId) {
    const { data, error } =
      await supabaseAdmin
        .from("therapy_professionals")
        .select("id, name, slug")
        .eq("id", professionalId)
        .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      return data;
    }
  }

  return profissionalPadrao();
}

/* =========================================================
   NORMALIZAÇÃO DAS PERGUNTAS

   Aqui colocamos as regras de segurança fixas do sistema.
========================================================= */

function normalizarPerguntas(
  valor: unknown
) {
  if (!Array.isArray(valor)) {
    return [];
  }

  return valor
    .map(
      (
        pergunta: PerguntaQuiz,
        index
      ) => {
        const prompt =
          String(
            pergunta?.prompt || ""
          ).trim();

        if (!prompt) {
          return null;
        }

        const tiposPermitidos:
          TipoPergunta[] = [
          "single_choice",
          "multiple_choice",
          "short_text",
          "long_text",
          "scale",
        ];

        const type =
          pergunta.type &&
          tiposPermitidos.includes(
            pergunta.type
          )
            ? pergunta.type
            : "single_choice";

        let options = Array.isArray(
          pergunta.options
        )
          ? pergunta.options
              .map((opcao) =>
                String(opcao).trim()
              )
              .filter(Boolean)
          : [];

        /*
         * Para perguntas de escolha,
         * a saída segura é sempre incluída.
         */
        if (
          type === "single_choice" ||
          type === "multiple_choice"
        ) {
          const jaTemOpcaoSegura =
            options.some(
              (opcao) =>
                opcao
                  .toLowerCase()
                  .includes(
                    "não consigo responder"
                  )
            );

          if (!jaTemOpcaoSegura) {
            options.push(
              TEXTO_SEGURANCA
            );
          }
        }

        return {
          id:
            String(
              pergunta.id || ""
            ).trim() ||
            `q-${index + 1}-${randomUUID()}`,

          type,

          prompt,

          helper:
            String(
              pergunta.helper || ""
            ).trim() || null,

          options,

          min:
            type === "scale"
              ? Number(
                  pergunta.min ?? 0
                )
              : null,

          max:
            type === "scale"
              ? Number(
                  pergunta.max ?? 10
                )
              : null,

          min_label:
            type === "scale"
              ? String(
                  pergunta.min_label ||
                    ""
                ).trim() || null
              : null,

          max_label:
            type === "scale"
              ? String(
                  pergunta.max_label ||
                    ""
                ).trim() || null
              : null,

          /*
           * Quiz terapêutico nunca
           * obriga o paciente a responder.
           */
          required: false,

          allow_skip: true,

          allow_stop: true,
        };
      }
    )
    .filter(Boolean);
}

function normalizarTipoQuiz(
  valor: unknown
) {
  const tipo =
    String(
      valor || "therapeutic"
    ).trim();

  if (
    tipo === "therapeutic" ||
    tipo === "feedback" ||
    tipo === "reflection" ||
    tipo === "checkin"
  ) {
    return tipo;
  }

  return "therapeutic";
}

/* =========================================================
   GET
   - lista quizzes
   - pode filtrar por paciente
   - pode filtrar por sessão
   - pode buscar um quiz específico
========================================================= */

export async function GET(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(request))
  ) {
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

  const clientId =
    request.nextUrl.searchParams
      .get("client_id")
      ?.trim();

  const appointmentId =
    request.nextUrl.searchParams
      .get("appointment_id")
      ?.trim();

  let consulta =
    supabaseAdmin
      .from("therapy_quizzes")
      .select(`
        id,
        professional_id,
        client_id,
        appointment_id,
        title,
        subtitle,
        source_notes,
        instructions,
        questions,
        status,
        quiz_type,
        published_at,
        created_at,
        updated_at,
        therapy_professionals (
          id,
          name,
          slug
        )
      `)
      .neq("status", "archived")
      .order("created_at", {
        ascending: false,
      });

  if (id) {
    consulta =
      consulta.eq("id", id);
  }

  if (clientId) {
    consulta =
      consulta.eq(
        "client_id",
        clientId
      );
  }

  if (appointmentId) {
    consulta =
      consulta.eq(
        "appointment_id",
        appointmentId
      );
  }

  const { data, error } =
    await consulta;

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  if (id) {
    return NextResponse.json({
      quiz: data?.[0] || null,
    });
  }

  return NextResponse.json({
    quizzes: data || [],
  });
}

/* =========================================================
   POST
   CRIAR QUIZ
========================================================= */

export async function POST(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(request))
  ) {
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

    const clientId =
      String(
        body.client_id || ""
      ).trim();

    const title =
      String(
        body.title || ""
      ).trim();

    if (!clientId) {
      return NextResponse.json(
        {
          error:
            "Paciente não informado.",
        },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Informe o título do quiz.",
        },
        { status: 400 }
      );
    }

    const profissional =
      await resolverProfissional(
        body.professional_id
      );

    const questions =
      normalizarPerguntas(
        body.questions
      );

    const status =
      body.status === "published"
        ? "published"
        : "draft";

    const instructions =
      String(
        body.instructions || ""
      ).trim() ||
      `Responda com calma e no seu próprio ritmo.

Não existe resposta certa ou errada.

Você não precisa se esforçar para lembrar, sentir ou explicar alguma coisa.

Em qualquer pergunta, você pode escolher não responder, pular ou parar por aqui.`;

    const { data, error } =
      await supabaseAdmin
        .from("therapy_quizzes")
        .insert({
          professional_id:
            profissional.id,

          client_id:
            clientId,

          appointment_id:
            body.appointment_id
              ? String(
                  body.appointment_id
                ).trim()
              : null,

          title,

          subtitle:
            String(
              body.subtitle || ""
            ).trim() || null,

          source_notes:
            String(
              body.source_notes || ""
            ).trim() || null,

          instructions,

          questions,

          status,

          quiz_type:
            normalizarTipoQuiz(
              body.quiz_type
            ),

          published_at:
            status === "published"
              ? new Date().toISOString()
              : null,
        })
        .select(`
          id,
          professional_id,
          client_id,
          appointment_id,
          title,
          subtitle,
          source_notes,
          instructions,
          questions,
          status,
          quiz_type,
          published_at,
          created_at,
          updated_at
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
        quiz: data,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao criar quiz.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   PATCH
   EDITAR / PUBLICAR / CONCLUIR
========================================================= */

export async function PATCH(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(request))
  ) {
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

    const id =
      String(
        body.id || ""
      ).trim();

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Quiz não informado.",
        },
        { status: 400 }
      );
    }

    const { data: atual } =
      await supabaseAdmin
        .from("therapy_quizzes")
        .select(
          "id, status, published_at"
        )
        .eq("id", id)
        .maybeSingle();

    if (!atual) {
      return NextResponse.json(
        {
          error:
            "Quiz não encontrado.",
        },
        { status: 404 }
      );
    }

    const alteracoes: Record<
      string,
      unknown
    > = {
      updated_at:
        new Date().toISOString(),
    };

    if (
      body.title !== undefined
    ) {
      const title =
        String(
          body.title || ""
        ).trim();

      if (!title) {
        return NextResponse.json(
          {
            error:
              "O título não pode ficar vazio.",
          },
          { status: 400 }
        );
      }

      alteracoes.title = title;
    }

    if (
      body.subtitle !== undefined
    ) {
      alteracoes.subtitle =
        String(
          body.subtitle || ""
        ).trim() || null;
    }

    if (
      body.source_notes !==
      undefined
    ) {
      alteracoes.source_notes =
        String(
          body.source_notes || ""
        ).trim() || null;
    }

    if (
      body.instructions !==
      undefined
    ) {
      alteracoes.instructions =
        String(
          body.instructions || ""
        ).trim() || null;
    }

    if (
      body.questions !== undefined
    ) {
      alteracoes.questions =
        normalizarPerguntas(
          body.questions
        );
    }

    if (
      body.quiz_type !== undefined
    ) {
      alteracoes.quiz_type =
        normalizarTipoQuiz(
          body.quiz_type
        );
    }

    if (
      body.status !== undefined
    ) {
      const status =
        String(
          body.status || ""
        ).trim();

      const permitidos = [
        "draft",
        "published",
        "completed",
        "archived",
      ];

      if (
        !permitidos.includes(status)
      ) {
        return NextResponse.json(
          {
            error:
              "Status do quiz inválido.",
          },
          { status: 400 }
        );
      }

      alteracoes.status = status;

      if (
        status === "published" &&
        !atual.published_at
      ) {
        alteracoes.published_at =
          new Date().toISOString();
      }
    }

    const { data, error } =
      await supabaseAdmin
        .from("therapy_quizzes")
        .update(alteracoes)
        .eq("id", id)
        .select(`
          id,
          professional_id,
          client_id,
          appointment_id,
          title,
          subtitle,
          source_notes,
          instructions,
          questions,
          status,
          quiz_type,
          published_at,
          created_at,
          updated_at
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

    return NextResponse.json({
      quiz: data,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar quiz.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE
   NÃO APAGA.
   ARQUIVA PARA PRESERVAR HISTÓRICO.
========================================================= */

export async function DELETE(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(request))
  ) {
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
          "Quiz não informado.",
      },
      { status: 400 }
    );
  }

  const { error } =
    await supabaseAdmin
      .from("therapy_quizzes")
      .update({
        status: "archived",
        updated_at:
          new Date().toISOString(),
      })
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