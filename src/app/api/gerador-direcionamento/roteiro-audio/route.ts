import https from "https";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function chamarOpenAI(apiKey: string, prompt: string) {
  return new Promise<string>((resolve, reject) => {
    const body = Buffer.from(
      JSON.stringify({
        model: "gpt-5.6",
        input: prompt,
        max_output_tokens: 900,
      }),
      "utf8"
    );

    const request = https.request(
      {
        hostname: "api.openai.com",
        port: 443,
        path: "/v1/responses",
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": body.length,
        },
      },
      (response) => {
        const chunks: Buffer[] = [];

        response.on("data", (chunk) => {
          chunks.push(Buffer.from(chunk));
        });

        response.on("end", () => {
          const resultado = Buffer.concat(chunks).toString("utf8");

          if (
            !response.statusCode ||
            response.statusCode < 200 ||
            response.statusCode >= 300
          ) {
            reject(
              new Error(
                `OpenAI ${response.statusCode}: ${resultado}`
              )
            );
            return;
          }

          try {
            const data = JSON.parse(resultado);

            const textos: string[] = [];

            for (const item of data.output || []) {
              for (const content of item.content || []) {
                if (
                  content.type === "output_text" &&
                  typeof content.text === "string"
                ) {
                  textos.push(content.text);
                }
              }
            }

            const textoFinal = textos.join("\n").trim();

            if (!textoFinal) {
              reject(
                new Error("A OpenAI respondeu, mas não retornou texto.")
              );
              return;
            }

            resolve(textoFinal);
          } catch {
            reject(
              new Error("Não foi possível interpretar a resposta da OpenAI.")
            );
          }
        });
      }
    );

    request.on("error", reject);

    request.setTimeout(90000, () => {
      request.destroy(
        new Error("Tempo excedido ao conectar com a OpenAI.")
      );
    });

    request.write(body);
    request.end();
  });
}

export async function POST(req: Request) {
  try {
    const { leitura, parecerAdria = "" } = await req.json();

    if (!leitura?.nome || !leitura?.semana) {
      return NextResponse.json(
        { erro: "Leitura inválida para gerar o roteiro." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { erro: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const primeiroNome =
      String(leitura.nome).trim().split(/\s+/)[0] ||
      leitura.nome;

    const dadosEssenciais = {
      nome: primeiroNome,
      semana: leitura.semana,

      energiaEspiritual: {
        nome: leitura.orixa,
        descricao: leitura.orixaPerfil?.descricao,
        ondeAjuda: leitura.orixaPerfil?.ondeAjuda,
      },

      cartaCigana: {
        carta: leitura.cartaCigana,
        reflexo: leitura.detalheCartaCigana?.reflexo,
        significado: leitura.significadoCartaCigana,
      },

      taro: {
        carta: leitura.cartaTaro,
        significado: leitura.significadoTaro,
      },

      naipe: {
        nome: leitura.detalheCartaCigana?.naipe,
        direcionamento:
          leitura.detalheCartaCigana?.direcionamentoNaipe,
      },

      elementoLenormand: {
        nome: leitura.detalheCartaCigana?.elemento,
        direcionamento:
          leitura.detalheCartaCigana?.direcionamentoLenormand,
        significado: leitura.significadoElemento,
      },

      numerologia: {
        semana: leitura.numerologiaDetalhe?.numeroSemana,
        nome: leitura.numerologiaDetalhe?.numeroNome,
        mensagem:
          leitura.numerologiaDetalhe?.mensagemUnificada,
        pontosFortes:
          leitura.numerologiaDetalhe?.pontosFortes,
        pontosAObservar:
          leitura.numerologiaDetalhe?.pontosFracos,
        aMelhorar:
          leitura.numerologiaDetalhe?.aMelhorar,
      },

      foco: {
        titulo: leitura.foco,
        mensagem: leitura.mensagemFoco,
        saude:
          leitura.foco === "Saúde"
            ? leitura.mensagemSaude
            : undefined,
      },
    };

    const prompt = `
Você escreve o resumo falado do Direcionamento Semanal de Ádria Freitas para uma assinante do Clube do Tarô.

IMPORTANTE:
Isto NÃO é um relatório, NÃO é uma leitura formal e NÃO é para narrar o PDF.
Precisa parecer um áudio natural de WhatsApp enviado pessoalmente pela Ádria.

TAMANHO:
- Aproximadamente 220 a 320 palavras.
- Fala de aproximadamente 1 minuto e meio a 2 minutos e meio.
- Seja direto.
- O PDF contém o aprofundamento.

JEITO DE FALAR DA ÁDRIA:
- Natural, próximo, carinhoso e espontâneo.
- Português do Brasil.
- Pode usar expressões naturais como:
  "olha",
  "logo de cara",
  "então",
  "hein?",
  "presta atenção nisso",
  "eu observaria isso esta semana".
- Não parecer texto de locutor, palestra, artigo ou podcast.
- Não usar linguagem excessivamente poética.
- Não fazer uma aula sobre cada carta.

ABERTURA:
Comece exatamente de forma natural, usando:

"Bom dia, ${primeiroNome}, tudo bem?"

Logo depois, faça um panorama da semana, semelhante a uma conversa:

"Olha, essa semana..."

Apresente naturalmente:
- energia espiritual/Orixá;
- vibração da semana;
- vibração do nome;
- Carta Cigana;
- Tarô;
- foco da semana.

Não transforme essa apresentação em lista.

DESENVOLVIMENTO:
Depois do panorama, converse sobre o sentido geral da combinação.

Explique um pouco a energia espiritual e como ela conversa com a semana.

Junte Carta Cigana e Tarô ao invés de criar uma explicação longa para cada um.

Quando falar de naipe e elemento, seja simples e natural, por exemplo:
"Essa carta vem no naipe de Espadas e trabalha com o elemento Ar, então..."

Explique somente o necessário para a pessoa compreender o que isso acrescenta ao direcionamento.

Integre a numerologia naturalmente à conversa.

FOCO DA SEMANA:
Dê atenção especial ao foco, mas sem transformar o áudio em consulta completa.

Conecte o foco ao conjunto da leitura.

Pode fazer uma pequena chamada prática e carinhosa, por exemplo:
"vamos prestar atenção nisso esta semana, hein?"
"vamos cuidar um pouco mais disso, tá?"

Se o foco for Saúde:
- não diagnostique;
- não diga que a pessoa tem uma doença;
- não substitua acompanhamento médico;
- pode incentivar cuidados gerais e exames de rotina de forma leve e responsável.

FINAL:
Convide a pessoa a ler o PDF, porque nele estão os detalhes.

Pode terminar naturalmente em linha semelhante a:

"Depois leia com calma o restante do seu PDF porque lá estão seus pontos fortes, o que observar e as outras orientações. Um beijo e tenha uma ótima semana."

REGRAS IMPORTANTES:
- Não inventar fatos sobre a vida da assinante.
- Não inventar cartas, números ou informações espirituais.
- Não fazer previsão.
- Não afirmar que algo vai acontecer.
- Não assustar.
- Não culpar.
- Não pressionar.
- Não tratar energia semanal como Orixá de cabeça.
- Babá Egum deve ser tratado como ancestralidade, não como Orixá.
- Não usar títulos.
- Não usar tópicos.
- Não usar numeração.
- Não separar cada elemento da leitura em um bloco técnico.
- Não repetir informações.
- Não escrever 500 ou 600 palavras.
- Não repetir todo o PDF.

DADOS APROVADOS:
${JSON.stringify(dadosEssenciais, null, 2)}

OBSERVAÇÕES DA ÁDRIA:
${
  String(parecerAdria || "").trim() ||
  "Nenhuma observação adicional."
}

Retorne SOMENTE a fala final do áudio.
`;

    const roteiro = await chamarOpenAI(apiKey, prompt);

    return NextResponse.json({ roteiro });
  } catch (error) {
    console.error(
      "Erro ao gerar roteiro de áudio:",
      error
    );

    return NextResponse.json(
      {
        erro:
          error instanceof Error
            ? error.message
            : "Erro ao gerar roteiro de áudio.",
      },
      { status: 500 }
    );
  }
}