import OpenAI from "openai";
import { NextResponse } from "next/server";

import type {
  Direcionamento,
  TipoEnergiaEspiritual,
} from "@/types/direcionamento";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const TIPOS_ESPIRITUAIS: TipoEnergiaEspiritual[] = [
  "orixa",
  "ancestralidade",
  "linha_espiritual",
  "entidade",
];

function texto(valor: unknown) {
  return typeof valor === "string"
    ? valor.trim()
    : "";
}

function lista(valor: unknown) {
  if (!Array.isArray(valor)) {
    return [];
  }

  return valor
    .filter(
      (item): item is string =>
        typeof item === "string"
    )
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function POST(req: Request) {
  try {
    const openai = getOpenAI();

    const body = await req.json();

    const nome = texto(body.nome);
    const plano = texto(body.plano);
    const semana = texto(body.semana);
    const periodo = texto(body.periodo);

    const vibracaoSemana = texto(
      body.numerologia?.vibracaoSemana
    );

    const essenciaNome = texto(
      body.numerologia?.essenciaNome
    );

    const tipoEnergia = texto(
      body.spiritualEnergy?.type
    ) as TipoEnergiaEspiritual;

    const nomeEnergia = texto(
      body.spiritualEnergy?.name
    );

    const cartaTitulo = texto(
      body.carta?.titulo
    );

    const naipe = texto(
      body.carta?.naipe
    );

    const elementoLenormand = texto(
      body.carta?.elementoLenormand
    );

    const elementoAdria = texto(
      body.carta?.elementoAdria
    );

    const taroTitulo = texto(
      body.taro?.titulo
    );

    const focoTitulo = texto(
      body.foco?.titulo
    );

    const parecerAdria = texto(
      body.parecerAdria
    );

    if (
      !nome ||
      !semana ||
      !periodo ||
      !vibracaoSemana ||
      !nomeEnergia ||
      !cartaTitulo ||
      !taroTitulo ||
      !focoTitulo
    ) {
      return NextResponse.json(
        {
          erro:
            "Faltam elementos principais da leitura.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !TIPOS_ESPIRITUAIS.includes(
        tipoEnergia
      )
    ) {
      return NextResponse.json(
        {
          erro:
            "Tipo de energia espiritual inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const leituraReal = {
      assinante: {
        nome,
        plano,
        semana,
        periodo,
      },

      numerologia: {
        vibracaoSemana,
        essenciaNome,
      },

      spiritualEnergy: {
        type: tipoEnergia,
        name: nomeEnergia,
      },

      carta: {
        titulo: cartaTitulo,
        naipe,
        elementoLenormand,
        elementoAdria,
      },

      taro: {
        titulo: taroTitulo,
      },

      foco: {
        titulo: focoTitulo,
      },

      parecerAdria,
    };

    const prompt = `
Você é um agente inteligente de apoio aos Direcionamentos do Clube do Tarô.

Seu trabalho NÃO é fazer o sorteio e NÃO é escolher os elementos da leitura.

A leitura já foi realizada por Ádria Freitas.

Os elementos fornecidos abaixo são DADOS REAIS DA LEITURA e devem ser preservados exatamente.

PROIBIDO:
- trocar a numerologia;
- escolher outro Orixá ou energia espiritual;
- trocar a Carta Cigana;
- trocar a carta do Tarô;
- alterar o foco;
- inventar acontecimentos da vida da assinante;
- inventar problemas familiares, amorosos, profissionais ou financeiros;
- afirmar acontecimentos futuros como certeza;
- transformar ancestralidade, entidade ou linha espiritual em Orixá;
- afirmar que um Orixá apresentado é o Orixá de cabeça da pessoa;
- criar informações pessoais que não estejam no parecer de Ádria.

REGRA ESPIRITUAL:
A energia espiritual apresentada representa a força, ensinamento ou influência trabalhada naquela semana.
Ela NÃO determina Orixá de cabeça.

Se o tipo for:
- "orixa": trate como energia de Orixá da semana;
- "ancestralidade": trate como ancestralidade;
- "linha_espiritual": trate como linha espiritual;
- "entidade": trate como entidade.

Se alguma característica complementar da energia espiritual não puder ser determinada com segurança, deixe o campo vazio em vez de inventar.

PARECER DA ÁDRIA:
O campo "parecerAdria" contém observações autorais da profissional.
Preserve o sentido dessas observações.
Você pode organizar, desenvolver e conectar o parecer com a leitura, mas NÃO pode acrescentar fatos pessoais inexistentes.

ESTILO:
- português do Brasil;
- linguagem simples, clara e acolhedora;
- profissional sem parecer técnica demais;
- espiritualidade tratada naturalmente;
- texto personalizado;
- direto;
- sem frases genéricas;
- sem redundâncias;
- sem repetir a mesma conclusão em várias seções;
- não use sequências artificiais de negação;
- não escreva como se estivesse tentando convencer a pessoa de que algo "não é acaso";
- cada seção deve acrescentar informação nova.

NUMEROLOGIA:
Interprete os números fornecidos.
Não recalcule e não substitua os números.

CARTA CIGANA:
Use exatamente a carta fornecida.
Se naipe e elementos forem fornecidos, considere-os na interpretação.
Não altere esses dados.

TARÔ:
Use exatamente a carta fornecida.
Não escolha outra carta.

FOCO:
Todo o Direcionamento deve convergir para o foco fornecido, sem forçar interpretações.

SAÚDE:
A seção de saúde deve falar apenas de autocuidado, equilíbrio e atenção ao bem-estar.
Não diagnostique doenças.
Não prescreva medicamentos.
Quando necessário, oriente a buscar profissional de saúde.

EXERCÍCIO:
Crie exercício viável, simples e relacionado à leitura da semana.

DIRECIONAMENTO PRÁTICO:
Crie ações concretas e possíveis.

CONSELHO FINAL:
Faça uma síntese autoral e personalizada.
Quando houver parecer da Ádria, ele deve ter peso especial nessa parte.

DADOS REAIS DA LEITURA:

${JSON.stringify(
  leituraReal,
  null,
  2
)}

Responda SOMENTE em JSON válido no formato abaixo:

{
  "resumo": {
    "numerologia": "",
    "energiaEspiritual": "",
    "carta": "",
    "taro": "",
    "foco": ""
  },

  "spiritualEnergy": {
    "type": "",
    "name": "",
    "titulo": "",
    "texto": "",
    "ondeAjuda": "",
    "cores": [],
    "diaPico": "",
    "elemento": "",
    "saudacao": ""
  },

  "carta": {
    "titulo": "",
    "naipe": "",
    "elementoLenormand": "",
    "elementoAdria": "",
    "texto": "",
    "naipeTexto": "",
    "elementoTexto": ""
  },

  "taro": {
    "titulo": "",
    "texto": ""
  },

  "numerologia": {
    "vibracaoSemana": "",
    "essenciaNome": "",
    "pontosFortes": [],
    "pontosObservar": [],
    "melhorar": []
  },

  "foco": {
    "titulo": "",
    "texto": ""
  },

  "espiritual": {
    "titulo": "",
    "texto": ""
  },

  "saude": {
    "titulo": "",
    "texto": ""
  },

  "direcionamentoPratico": [],
  "exercicioSemana": [],
  "conselhoFinal": ""
}
`;

    const response =
      await openai.responses.create({
        model: "gpt-5.6",
        input: prompt,
        text: {
          format: {
            type: "json_object",
          },
        },
      });

    if (!response.output_text) {
      throw new Error(
        "A IA não retornou conteúdo."
      );
    }

    const gerado = JSON.parse(
      response.output_text
    );

    /*
     * IMPORTANTE:
     * Mesmo que a IA tente alterar algum
     * elemento da leitura, estes campos
     * são sobrescritos abaixo pelos dados
     * reais enviados pela Ádria.
     */

    const resultado: Direcionamento = {
      resumo: {
        numerologia:
          essenciaNome
            ? `Vibração ${vibracaoSemana} • Essência ${essenciaNome}`
            : `Vibração ${vibracaoSemana}`,

        energiaEspiritual:
          nomeEnergia,

        carta:
          cartaTitulo,

        taro:
          taroTitulo,

        foco:
          focoTitulo,
      },

      spiritualEnergy: {
        type: tipoEnergia,
        name: nomeEnergia,

        titulo:
          texto(
            gerado
              ?.spiritualEnergy
              ?.titulo
          ) || nomeEnergia,

        texto: texto(
          gerado
            ?.spiritualEnergy
            ?.texto
        ),

        ondeAjuda: texto(
          gerado
            ?.spiritualEnergy
            ?.ondeAjuda
        ),

        cores: lista(
          gerado
            ?.spiritualEnergy
            ?.cores
        ),

        diaPico: texto(
          gerado
            ?.spiritualEnergy
            ?.diaPico
        ),

        elemento: texto(
          gerado
            ?.spiritualEnergy
            ?.elemento
        ),

        saudacao: texto(
          gerado
            ?.spiritualEnergy
            ?.saudacao
        ),
      },

      carta: {
        titulo: cartaTitulo,
        naipe,
        elementoLenormand,
        elementoAdria,

        texto: texto(
          gerado?.carta?.texto
        ),

        naipeTexto: texto(
          gerado
            ?.carta
            ?.naipeTexto
        ),

        elementoTexto: texto(
          gerado
            ?.carta
            ?.elementoTexto
        ),
      },

      taro: {
        titulo: taroTitulo,

        texto: texto(
          gerado?.taro?.texto
        ),
      },

      numerologia: {
        vibracaoSemana,
        essenciaNome,

        pontosFortes: lista(
          gerado
            ?.numerologia
            ?.pontosFortes
        ),

        pontosObservar: lista(
          gerado
            ?.numerologia
            ?.pontosObservar
        ),

        melhorar: lista(
          gerado
            ?.numerologia
            ?.melhorar
        ),
      },

      foco: {
        titulo: focoTitulo,

        texto: texto(
          gerado?.foco?.texto
        ),
      },

      espiritual: {
        titulo:
          texto(
            gerado
              ?.espiritual
              ?.titulo
          ) || "Espiritual",

        texto: texto(
          gerado
            ?.espiritual
            ?.texto
        ),
      },

      saude: {
        titulo:
          texto(
            gerado
              ?.saude
              ?.titulo
          ) || "Saúde e Bem-estar",

        texto: texto(
          gerado?.saude?.texto
        ),
      },

      direcionamentoPratico:
        lista(
          gerado
            ?.direcionamentoPratico
        ),

      exercicioSemana:
        lista(
          gerado
            ?.exercicioSemana
        ),

      conselhoFinal:
        texto(
          gerado?.conselhoFinal
        ),
    };

    return NextResponse.json(
      resultado
    );
  } catch (error: unknown) {
    console.error(
      "ERRO GERADOR DIRECIONAMENTO:",
      error
    );

    return NextResponse.json(
      {
        erro:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}