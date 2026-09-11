import OpenAI from "openai";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

type ModoGeracao =
  | "questions"
  | "full_quiz"
  | "improve_question";

type TipoPergunta =
  | "single_choice"
  | "multiple_choice"
  | "short_text"
  | "long_text"
  | "scale";

const TIPOS_PERMITIDOS: TipoPergunta[] = [
  "single_choice",
  "multiple_choice",
];

function bearerToken(
  request: NextRequest
) {
  const authorization =
    request.headers.get(
      "authorization"
    ) || "";

  return authorization.startsWith(
    "Bearer "
  )
    ? authorization
        .slice(7)
        .trim()
    : "";
}

async function autorizarAdmin(
  request: NextRequest
) {
  const token =
    bearerToken(request);

  if (!token) return false;

  const {
    data: { user },
  } =
    await supabaseAdmin.auth.getUser(
      token
    );

  if (!user?.email) {
    return false;
  }

  const { data: admin } =
    await supabaseAdmin
      .from("club_clients")
      .select("id")
      .ilike(
        "email",
        user.email
      )
      .eq("role", "admin")
      .maybeSingle();

  return Boolean(admin);
}

function limitarQuantidade(
  valor: unknown
) {
  const numero =
    Number(valor || 5);

  if (
    !Number.isFinite(numero)
  ) {
    return 5;
  }

  return Math.min(
    20,
    Math.max(
      1,
      Math.round(numero)
    )
  );
}

function extrairJson(
  texto: string
) {
  const limpo = texto
    .trim()
    .replace(
      /^```json\s*/i,
      ""
    )
    .replace(
      /^```\s*/i,
      ""
    )
    .replace(
      /\s*```$/i,
      ""
    )
    .trim();

  return JSON.parse(limpo);
}

function normalizarPergunta(
  valor: Record<
    string,
    unknown
  >
) {
  const prompt =
    String(
      valor?.prompt || ""
    ).trim();

  if (!prompt) {
    return null;
  }

  const tipoRecebido =
    String(
      valor?.type || ""
    ) as TipoPergunta;

  const type =
    TIPOS_PERMITIDOS.includes(
      tipoRecebido
    )
      ? tipoRecebido
      : "single_choice";

  const ehEscolha =
    type ===
      "single_choice" ||
    type ===
      "multiple_choice";

  const options =
    ehEscolha &&
    Array.isArray(
      valor?.options
    )
      ? valor.options
          .map((item) =>
            String(
              item || ""
            ).trim()
          )
          .filter(Boolean)
          .slice(0, 6)
      : [];

  const min =
    type === "scale"
      ? Number(
          valor?.min ?? 0
        )
      : 0;

  const max =
    type === "scale"
      ? Number(
          valor?.max ?? 10
        )
      : 10;

  return {
    type,
    prompt,

    helper:
      String(
        valor?.helper || ""
      ).trim(),

    options,

    min:
      Number.isFinite(min)
        ? min
        : 0,

    max:
      Number.isFinite(max)
        ? max
        : 10,

    min_label:
      String(
        valor?.min_label ||
          ""
      ).trim(),

    max_label:
      String(
        valor?.max_label ||
          ""
      ).trim(),
  };
}

function instrucoesAgente() {
  return `
Você é um agente inteligente de apoio para criação de quizzes,
questionários, formulários, check-ins, feedbacks, avaliações,
pesquisas de satisfação e atividades profissionais.

O profissional sempre revisará e poderá editar tudo antes de publicar.

REGRAS:
- Escreva em português do Brasil.
- Use linguagem clara, humana e profissional.
- Não faça diagnósticos.
- Não afirme que uma pessoa possui doença, trauma ou condição.
- Em contexto terapêutico, não pressione a pessoa a recordar acontecimentos.
- Não sugira memórias que a pessoa não relatou.
- Não faça perguntas que presumam abuso, trauma ou acontecimentos.
- - Evite repetição.
- As respostas devem ser simples, rápidas e feitas por clique.
- Use somente escolha única ou múltipla escolha.
- Não use escalas numéricas de 0 a 10.
- Não gere campos de texto curto ou texto longo.
- Prefira respostas objetivas como:
  Sim / Não
  Gostei / Não gostei
  Concordo / Não concordo
  Sempre / Às vezes / Nunca
  Muito / Pouco / Nada
  ou outras alternativas diretas adequadas à pergunta.
- Gere entre 2 e 5 opções de resposta.
- Não acrescente "Prefiro não responder".
- O sistema acrescentará essa opção automaticamente.
- Retorne SOMENTE JSON válido.
- Não use Markdown.
- Não escreva explicações fora do JSON.

Tipos permitidos:
single_choice
multiple_choice
short_text
long_text
scale
`;
}

function formatoPergunta() {
  return `
{
  "type": "single_choice",
  "prompt": "Pergunta",
  "helper": "",
  "options": ["Opção 1", "Opção 2"],
  "min": 0,
  "max": 10,
  "min_label": "",
  "max_label": ""
}
`;
}

export async function POST(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(
      request
    ))
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
    const apiKey =
      process.env
        .OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "A chave da OpenAI ainda não está configurada.",
        },
        { status: 500 }
      );
    }

    const body =
      await request.json();

    const mode =
      String(
        body.mode ||
          "questions"
      ) as ModoGeracao;

    if (
      ![
        "questions",
        "full_quiz",
        "improve_question",
      ].includes(mode)
    ) {
      return NextResponse.json(
        {
          error:
            "Modo de geração inválido.",
        },
        { status: 400 }
      );
    }

    const tema =
      String(
        body.theme || ""
      ).trim();

    const objetivo =
      String(
        body.goal || ""
      ).trim();

    const contexto =
      String(
        body.context || ""
      ).trim();

    const tipoQuiz =
      String(
        body.quiz_type ||
          "therapeutic"
      ).trim();

    const quantidade =
      limitarQuantidade(
        body.count
      );

    const perguntaAtual =
      String(
        body.question || ""
      ).trim();

    if (
      mode !==
        "improve_question" &&
      !tema
    ) {
      return NextResponse.json(
        {
          error:
            "Informe o tema central.",
        },
        { status: 400 }
      );
    }

    if (
      mode ===
        "improve_question" &&
      !perguntaAtual
    ) {
      return NextResponse.json(
        {
          error:
            "Informe a pergunta que deseja melhorar.",
        },
        { status: 400 }
      );
    }

    let pedido = "";

    if (
      mode === "questions"
    ) {
      pedido = `
Gere ${quantidade} perguntas.

Tema central:
${tema}

Objetivo:
${objetivo || "Não informado"}

Tipo de uso:
${tipoQuiz}

Contexto adicional:
${contexto || "Não informado"}

Retorne:

{
  "questions": [
    ${formatoPergunta()}
  ]
}
`;
    }

    if (
      mode === "full_quiz"
    ) {
      pedido = `
Crie um quiz completo com ${quantidade} perguntas.

Tema central:
${tema}

Objetivo:
${objetivo || "Não informado"}

Tipo de uso:
${tipoQuiz}

Contexto adicional:
${contexto || "Não informado"}

Crie título, subtítulo, orientação inicial e perguntas variadas.

Retorne:

{
  "title": "Título",
  "subtitle": "Subtítulo",
  "instructions": "Orientação",
  "questions": [
    ${formatoPergunta()}
  ]
}
`;
    }

    if (
      mode ===
      "improve_question"
    ) {
      pedido = `
Melhore esta pergunta:

"${perguntaAtual}"

Objetivo:
${objetivo || "Deixar mais clara e natural"}

Contexto:
${contexto || "Não informado"}

Retorne:

{
  "questions": [
    ${formatoPergunta()}
  ]
}
`;
    }

    const openai =
      new OpenAI({
        apiKey,
      });

    const response =
      await openai.responses.create(
        {
          model:
            process.env
              .OPENAI_QUIZ_MODEL ||
            "gpt-5.6-luna",

          instructions:
            instrucoesAgente(),

          input: pedido,
        }
      );

    const texto =
      response.output_text;

    if (!texto) {
      throw new Error(
        "O agente não retornou conteúdo."
      );
    }

    const bruto =
      extrairJson(texto);

    const lista =
      Array.isArray(
        bruto?.questions
      )
        ? bruto.questions
        : [];

    const perguntas =
      lista
        .map((item: unknown) =>
  normalizarPergunta(
    item as Record<
      string,
      unknown
    >
  )
)
        .filter(
  (
    item: ReturnType<typeof normalizarPergunta>
  ): item is NonNullable<
    ReturnType<typeof normalizarPergunta>
  > => item !== null
)
        .slice(
          0,
          mode ===
            "improve_question"
            ? 1
            : quantidade
        );

    if (
      perguntas.length === 0
    ) {
      throw new Error(
        "O agente não conseguiu gerar perguntas válidas."
      );
    }

    return NextResponse.json({
      success: true,
      mode,

      quiz: {
        title:
          String(
            bruto?.title || ""
          ).trim(),

        subtitle:
          String(
            bruto?.subtitle ||
              ""
          ).trim(),

        instructions:
          String(
            bruto?.instructions ||
              ""
          ).trim(),

        questions: perguntas,
      },
    });
  } catch (
    error: unknown
  ) {
    console.error(
      "Erro no agente de quiz:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível gerar o conteúdo com IA.",
      },
      { status: 500 }
    );
  }
}
