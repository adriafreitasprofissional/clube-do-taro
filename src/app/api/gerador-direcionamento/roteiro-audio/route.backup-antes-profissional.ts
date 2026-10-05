import https from "https";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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
    const {
      leitura,
      parecerAdria = "",
      slug = "",
    } = await req.json();

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

    const primeiroNomeCadastro =
      String(leitura.nome).trim().split(/\s+/)[0] ||
      leitura.nome;

    let nomeReferencia = "";

    if (slug && typeof slug === "string") {
      const {
        data: cliente,
        error: clienteError,
      } = await supabaseAdmin
        .from("club_clients")
        .select("nome_referencia")
        .eq("slug", slug)
        .maybeSingle();

      if (clienteError) {
        console.warn(
          "Não foi possível buscar nome_referencia. Usando primeiro nome do cadastro:",
          clienteError.message
        );
      } else {
        nomeReferencia = String(
          cliente?.nome_referencia || ""
        ).trim();
      }
    }

    const nomeParaAudio =
      nomeReferencia || primeiroNomeCadastro;

    const dadosEssenciais = {
      nome: nomeParaAudio,
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

OBJETIVO:
Criar uma fala natural, simples, direta e personalizada, como se Ádria estivesse falando pessoalmente com a assinante. Não é relatório, não é aula e não é narração do PDF.

NOME:
- Use sempre este nome ao falar com a assinante: "${nomeParaAudio}".
- Este nome já prioriza o nome de referência cadastrado, como Nena, Bia ou Gabi.
- Não troque por outro nome e não use o nome completo se o nome de referência estiver disponível.

TAMANHO:
- Aproximadamente 220 a 320 palavras.
- Fala de cerca de 1 minuto e meio a 2 minutos e meio.
- O PDF contém o aprofundamento; o áudio deve selecionar somente o que realmente importa.

ESTILO:
- Português do Brasil.
- Humano, próximo, acolhedor e firme quando necessário.
- Frases claras e naturais, próprias de fala.
- Vá direto ao sentido da leitura.
- Integre energia espiritual, numerologia, Carta Cigana, Tarô, naipe, elemento e foco sem transformar o texto em lista.
- Quando houver observação da Ádria, ela tem prioridade e deve entrar de forma natural no direcionamento.
- Transforme os símbolos em orientação prática para a semana.
- Varie a construção do texto. Não reproduza a mesma abertura, transição e encerramento em todos os roteiros.
- O texto deve soar como conversa real, sem marcas de texto gerado por IA.

ABERTURA:
Comece apenas com:
"Bom dia, ${nomeParaAudio}, tudo bem?"

Depois disso, siga diretamente para a leitura. Não use uma segunda frase de abertura padronizada.

EVITE EXPRESSAMENTE:
- "logo de cara";
- "Olha, essa semana...";
- "tá?" como bordão;
- "hein?" como bordão;
- "essa combinação pede" repetidamente;
- "é um convite para";
- "o universo está mostrando";
- "energia de transformação";
- construções artificiais do tipo "não é X, é Y";
- sequências como "não foi isso, não foi aquilo, foi...";
- frases de efeito em série;
- frases prontas ou conclusões genéricas;
- repetir a mesma ideia com palavras diferentes;
- excesso de adjetivos;
- tom de locutor, palestra, artigo, podcast ou texto de IA;
- linguagem excessivamente poética.

DESENVOLVIMENTO:
- Apresente a energia espiritual e explique de forma simples como ela conversa com o momento da semana.
- Una Carta Cigana e Tarô quando fizer sentido, em vez de explicar cada carta isoladamente.
- Explique naipe e elemento apenas quando acrescentarem algo útil.
- Integre a numerologia à leitura sem criar um bloco técnico.
- Dê atenção especial ao foco da semana.
- Se houver pergunta, preocupação ou observação da Ádria, responda de forma objetiva e coerente com os dados disponíveis.
- Não invente fatos da vida da assinante.
- Prefira orientações concretas a frases abstratas.
- Se uma ideia já foi dita, avance; não explique novamente.

FINAL:
- Termine com uma orientação concreta para a pessoa aplicar na semana.
- Convide brevemente a consultar o PDF para os detalhes.
- Não use sempre a mesma frase final.
- O encerramento deve ser simples e natural.
ENCERRAMENTO OBRIGATÓRIO:
- Sempre termine o roteiro com uma despedida.
- Use o nome de referência/apelido da pessoa, que está em leitura.nome.
- Termine exatamente neste formato:

"Ótima semana, ${leitura.nome}. Beijos."

CUIDADOS:
- Não inventar cartas, números, acontecimentos ou informações espirituais.
- Não fazer previsão absoluta nem afirmar que algo certamente acontecerá.
- Não assustar, culpar ou pressionar.
- Não tratar energia semanal como Orixá de cabeça.
- Babá Egum deve ser tratado como ancestralidade, não como Orixá.
- Se o foco for Saúde, não diagnosticar nem substituir avaliação profissional; pode orientar cuidados gerais e avaliação adequada quando necessário.
- Não usar títulos, tópicos ou numeração na resposta final.
- Não repetir o PDF.
- Não repetir frases ou estruturas dentro do próprio roteiro.


Não use nome completo se houver nome de referência.
Não invente outro nome.
Não omita a despedida.

DADOS APROVADOS:
${JSON.stringify(dadosEssenciais, null, 2)}

OBSERVAÇÕES DA ÁDRIA:
${
  String(parecerAdria || "").trim() ||
  "Nenhuma observação adicional."
}

Retorne SOMENTE a fala final do áudio, pronta para gravação.
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
