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

type PerguntaGerada = {
  type: TipoPergunta;
  prompt: string;
  helper: string;
  options: string[];
  min: number;
  max: number;
  min_label: string;
  max_label: string;
};

const TIPOS_PERMITIDOS: TipoPergunta[] = [
  "single_choice",
  "multiple_choice",
  "short_text",
  "long_text",
  "scale",
];

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

function limitarQuantidade(
  valor: unknown
) {
  const numero = Number(valor || 5);

  if (!Number.isFinite(numero)) {
    return 5;
  }

  return Math.min(
    20,
    Math.max(1, Math.round(numero))
  );
}

function extrairJson(texto: string) {
  const limpo = texto
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(limpo);
}

function normalizarPergunta(
  valor: any
): PerguntaGerada | null {
  const prompt = String(
    valor?.prompt || ""
  ).trim();

  if (!prompt) {
    return null;
  }

  const type: TipoPergunta =
    TIPOS_PERMITIDOS.includes(
      valor?.type
    )
      ? valor.type
      : "single_choice";

  const options =
    type === "single_choice" ||
    type === "multiple_choice"
      ? Array.isArray(valor?.options)
        ? valor.options
            .map((item: unknown) =>
              String(item || "").trim()
            )
            .filter(Boolean)
            .slice(0, 6)
        : []
      : [];

  const min =
    type === "scale"
      ? Number(valor?.min ?? 0)
      : 0;

  const max =
    type === "scale"
      ? Number(valor?.max ?? 10)
      : 10;

  return {
    type,
    prompt,

    helper: String(
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

    min_label: String(
      valor?.min_label || ""
    ).trim(),

    max_label: String(
      valor?.max_label || ""
    ).trim(),
  };
}

function instrucoesDoAgente() {
  return `
Você é um agente inteligente de apoio para criação de quizzes,
questionários, formulários, check-ins, feedbacks, avaliações,
pesquisas de satisfação e atividades profissionais.

Sua função é ajudar o profissional a elaborar o conteúdo.
O profissional sempre terá controle para revisar e editar antes
de publicar.

REGRAS:

- Escreva em português do Brasil.
- Use linguagem clara, humana e profissional.
- Não crie diagnósticos.
- Não afirme que uma pessoa possui uma doença, trauma ou condição.
- Em contexto terapêutico, não pressione a pessoa a recordar acontecimentos.
- Não sugira memórias que a pessoa não relatou.
- Não faça perguntas indutivas que assumam abuso, trauma ou acontecimentos.
- Prefira perguntas abertas, respeitosas e não acusatórias.
- Evite perguntas repetitivas.
- Varie os tipos de pergunta quando fizer sentido.
- Para escolha única ou múltipla, gere entre 2 e 5 opções úteis.
- NÃO acrescente a opção "No momento não consigo responder isso".
  O sistema acrescentará essa opção automaticamente.
- Escalas devem normalmente usar 0 a 10.
- O conteúdo precisa poder ser editado pelo profissional.
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

function estruturaPerguntaJson() {
  return `
Cada pergunta deve seguir:

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
    const apiKey =
      process.env.OPENAI_API_KEY;

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

    const mode = String(
      body.mode || "questions"
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

    const tema = String(
      body.theme || ""
    ).trim();

    const objetivo = String(
      body.goal || ""
    ).trim();

    const contexto = String(
      body.context || ""
    ).trim();

    const tipoQuiz = String(
      body.quiz_type || "therapeutic"
    ).trim();

    const quantidade =
      limitarQuantidade(
        body.count
      );

    const perguntaAtual = String(
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

    if (mode === "questions") {
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

Retorne exatamente esta estrutura:

{
  "questions": [
    ${estruturaPerguntaJson()}
  ]
}
`;
    }

    if (mode === "full_quiz") {
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

Crie:
- título curto;
- subtítulo;
- orientação inicial;
- perguntas variadas.

Retorne exatamente esta estrutura:

{
  "title": "Título",
  "subtitle": "Subtítulo",
  "instructions": "Orientação para quem vai responder",
  "questions": [
    ${estruturaPerguntaJson()}
  ]
}
`;
    }

    if (
      mode ===
      "improve_question"
    ) {
      pedido = `
Melhore somente esta pergunta:

"${perguntaAtual}"

Objetivo:
${objetivo || "Deixar a pergunta mais clara, acolhedora e útil"}

Contexto:
${contexto || "Não informado"}

Retorne exatamente:

{
  "questions": [
    ${estruturaPerguntaJson()}
  ]
}
`;
    }

    const openai =
      new OpenAI({
        apiKey,
      });

    const response =
      await openai.responses.create({
        model:
          process.env
            .OPENAI_QUIZ_MODEL ||
          "gpt-5.6-luna",

        instructions:
          instrucoesDoAgente(),

        input: pedido,
      });

    const texto =
      response.output_text;

    if (!texto) {
      throw new Error(
        "O agente não retornou conteúdo."
      );
    }

    const bruto =
      extrairJson(texto);

    const perguntas =
      Array.isArray(
        bruto?.questions
      )
        ? bruto.questions
            .map(
              normalizarPergunta
            )
            .filter(Boolean)
            .slice(
              0,
              mode ===
                "improve_question"
                ? 1
                : quantidade
            )
        : [];

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
            bruto?.subtitle || ""
          ).trim(),

        instructions:
          String(
            bruto?.instructions ||
              ""
          ).trim(),

        questions: perguntas,
      },
    });
  } catch (error: unknown) {
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