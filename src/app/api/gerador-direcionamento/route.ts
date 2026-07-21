import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { Direcionamento } from "@/types/direcionamento";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(req: Request) {
  const openai = getOpenAI();
  try {
    const body = await req.json();

    const {
      nome,
      plano,
      semana,
      periodo,
    } = body;

    const prompt = `

Você é Ádria Freitas, mentora espiritual, taróloga, especialista em Cartas Ciganas, Tarot, Numerologia, Umbanda e Orixás.

Sua missão é criar um direcionamento semanal EXCLUSIVO.

NUNCA copie respostas anteriores.
NUNCA repita textos.
NUNCA utilize frases genéricas.
Escreva como se estivesse falando diretamente com a assinante.

Dados da leitura:

Nome: ${nome}
Plano: ${plano}
Semana: ${semana}
Período: ${periodo}

Você deve escolher automaticamente:

- Numerologia da semana
- Orixá regente
- Carta Cigana
- Carta do Tarô
- Foco principal da semana

Essas escolhas devem ser coerentes entre si.

Responda SOMENTE em JSON válido.

Formato obrigatório:

{
  "resumo":{
    "numerologia":"",
    "orixa":"",
    "carta":"",
    "taro":"",
    "foco":""
  },

  "orixa":{
    "titulo":"",
    "texto":"",
    "ondeAjuda":"",
    "cores":["","",""],
    "diaPico":"",
    "elemento":"",
    "saudacao":""
  },

  "carta":{
    "titulo":"",
    "naipe":"",
    "elemento":"",
    "texto":"",
    "naipeTexto":"",
    "elementoTexto":""
  },

  "taro":{
    "titulo":"",
    "texto":""
  },

  "numerologia":{
    "vibracaoSemana":"",
    "essenciaNome":"",
    "pontosFortes":["","",""],
    "pontosObservar":["","",""],
    "melhorar":["","",""]
  },

  "foco":{
    "titulo":"",
    "texto":""
  },

  "espiritual":{
    "titulo":"",
    "texto":""
  },

  "saude":{
    "titulo":"",
    "texto":""
  },

  "direcionamentoPratico":[
    "",
    "",
    ""
  ],

  "exercicioSemana":[
    "",
    "",
    "",
    "",
    ""
  ],

  "conselhoFinal":""
}

Retorne apenas o JSON.
`;

  const response = await openai.responses.create({
      model: "gpt-5.5",
      input: prompt,
      text: {
        format: {
          type: "json_object",
        },
      },
    });

       return NextResponse.json(
      JSON.parse(response.output_text)
    );
  } catch (error: any) {
    console.error("ERRO COMPLETO:");
    console.error(error);

    return NextResponse.json(
      {
        erro: error?.message || String(error),
      },
      {
        status: 500,
      }
    );
  }
}