import OpenAI from "openai";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization") || "";

  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
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

  const { data: admin } = await supabaseAdmin
    .from("club_clients")
    .select("id")
    .ilike("email", user.email)
    .eq("role", "admin")
    .maybeSingle();

  return Boolean(admin);
}

function textoSeguro(valor: unknown) {
  return String(valor || "").trim();
}

export async function POST(
  request: NextRequest
) {
  try {
    if (!(await autorizarAdmin(request))) {
      return NextResponse.json(
        {
          error:
            "Acesso administrativo não autorizado.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const nomeAssinante = textoSeguro(
      body.nome_assinante
    );

    const titulo = textoSeguro(body.titulo);

    const parecerAdria = textoSeguro(
      body.report_adria
    );

    const parecerEstella = textoSeguro(
      body.report_estella
    );

    if (!parecerAdria || !parecerEstella) {
      return NextResponse.json(
        {
          error:
            "Preencha o relatório da Ádria e o relatório da Estella.",
        },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
Você é um agente editorial de apoio às mentorias
do Clube do Tarô de Ádria Freitas.

Sua função é organizar os relatos da mentora Ádria
e a mensagem espiritual recebida de Estella.

A assinante não deve ser julgada, diagnosticada,
rotulada ou tratada como alguém com defeito.

Não invente acontecimentos, traumas, doenças,
sintomas ou informações que não estejam nos relatos.

As orientações devem ser acolhedoras, práticas,
respeitosas e coerentes com o que foi anotado.

Você pode sugerir exercícios seguros de reflexão,
escrita, respiração, organização da rotina,
autoconhecimento, limites pessoais, descanso,
alimentação equilibrada, sono e autocuidado.

Nunca prescreva medicamentos.
Nunca recomende interromper tratamentos.
Nunca apresente diagnóstico médico ou psicológico.
Nunca substitua acompanhamento profissional.

Evite frases genéricas, repetições e promessas
de cura ou resultados garantidos.

DADOS DA MENTORIA

Assinante:
${nomeAssinante || "Não informado"}

Título:
${titulo || "Mentoria individual"}

PARECER DA ÁDRIA

${parecerAdria}

MENSAGEM ESPIRITUAL DE ESTELLA

${parecerEstella}

Crie um relatório pessoal e organizado.

Responda SOMENTE com JSON válido neste formato:

{
  "sintese": "",
  "pontos_desenvolver": "",
  "exercicios_praticos": "",
  "orientacoes_vida_saudavel": "",
  "plano_acompanhamento": "",
  "mensagem_final": ""
}

REGRAS DE CONTEÚDO

"sintese":
Faça uma síntese clara e profunda do momento atual.

"pontos_desenvolver":
Liste os aspectos que merecem atenção e desenvolvimento.
Use tópicos iniciados por •.

"exercicios_praticos":
Crie de três a cinco exercícios relacionados diretamente
aos relatos. Explique como realizar cada exercício.
Use tópicos iniciados por •.

"orientacoes_vida_saudavel":
Crie orientações simples e possíveis para rotina,
bem-estar e autocuidado. Use tópicos iniciados por •.

"plano_acompanhamento":
Organize pequenas ações para os próximos sete dias.
Use tópicos iniciados por •.

"mensagem_final":
Escreva uma mensagem final acolhedora, pessoal,
forte e coerente com os dois pareceres.
`;

    const response =
      await openai.responses.create({
        model: "gpt-5.5",

        input: prompt,

        text: {
          format: {
            type: "json_object",
          },
        },
      });

    const relatorio = JSON.parse(
      response.output_text
    );

    return NextResponse.json({
      relatorio,

      generated_at:
        new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error(
      "Erro ao gerar relatório da mentoria:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível gerar o relatório.",
      },
      { status: 500 }
    );
  }
}