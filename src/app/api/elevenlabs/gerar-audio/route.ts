import { NextResponse } from "next/server";
import https from "https";
import {
  garantirPastaAssinante,
  salvarArquivoDrive,
} from "@/lib/google-drive";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function numeroSemanaDoMes(data: Date) {
  const primeiroDia = new Date(
    data.getFullYear(),
    data.getMonth(),
    1
  );

  const diaSemanaPrimeiro =
    (primeiroDia.getDay() + 6) % 7;

  return Math.ceil(
    (data.getDate() + diaSemanaPrimeiro) / 7
  );
}

export async function POST(req: Request) {
  try {
    const {
      texto,
      nome,
      slug,
      dataInicio,
      dataFim,
    } = await req.json();

    if (!texto || typeof texto !== "string") {
      return NextResponse.json(
        { error: "Texto do áudio não informado." },
        { status: 400 }
      );
    }

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          error:
            "Assinante sem slug para localizar a pasta do Drive.",
        },
        { status: 400 }
      );
    }

    if (
      !dataInicio ||
      typeof dataInicio !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Data inicial da semana não informada.",
        },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.ELEVENLABS_API_KEY;

    const voiceId =
      process.env.ELEVENLABS_VOICE_ID;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "ELEVENLABS_API_KEY não configurada.",
        },
        { status: 500 }
      );
    }

    if (!voiceId) {
      return NextResponse.json(
        {
          error:
            "ELEVENLABS_VOICE_ID não configurado.",
        },
        { status: 500 }
      );
    }

    const body = Buffer.from(
      JSON.stringify({
        text: texto,
        model_id: "eleven_multilingual_v2",
      }),
      "utf8"
    );

    const audio = await new Promise<Buffer>(
      (resolve, reject) => {
        const request = https.request(
          {
            hostname: "api.elevenlabs.io",
            port: 443,
            path: `/v1/text-to-speech/${encodeURIComponent(
              voiceId
            )}?output_format=mp3_44100_128`,
            method: "POST",
            headers: {
              "xi-api-key": apiKey,
              Accept: "audio/mpeg",
              "Content-Type":
                "application/json; charset=utf-8",
              "Content-Length": body.length,
            },
          },
          (response) => {
            const chunks: Buffer[] = [];

            response.on("data", (chunk) => {
              chunks.push(Buffer.from(chunk));
            });

            response.on("end", () => {
              const resultado =
                Buffer.concat(chunks);

              if (
                !response.statusCode ||
                response.statusCode < 200 ||
                response.statusCode >= 300
              ) {
                reject(
                  new Error(
                    `ElevenLabs ${response.statusCode}: ${resultado.toString(
                      "utf8"
                    )}`
                  )
                );
                return;
              }

              resolve(resultado);
            });
          }
        );

        request.on("error", reject);
        request.write(body);
        request.end();
      }
    );

    const dataInicial = new Date(`${dataInicio}T12:00:00`);
    const dataFinal = dataFim
      ? new Date(`${dataFim}T12:00:00`)
      : new Date(dataInicial);

    if (!dataFim) {
      dataFinal.setDate(dataFinal.getDate() + 6);
    }

    const diferencaDias = Math.round(
      (dataFinal.getTime() - dataInicial.getTime()) / 86400000
    );

    const data = new Date(dataInicial);
    data.setDate(
      data.getDate() + Math.floor(diferencaDias / 2)
    );

    if (Number.isNaN(data.getTime())) {
      throw new Error(
        "Data inicial inválida."
      );
    }

    const pasta =
      await garantirPastaAssinante({
        slug,
        data,
      });

    const semana =
      numeroSemanaDoMes(data);

    const dia = String(
      data.getDate()
    ).padStart(2, "0");

    const mes = String(
      data.getMonth() + 1
    ).padStart(2, "0");

    const slugSeguro = slug
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(/^-|-$/g, "");

    const nomeArquivo =
      `semana-${semana}-${slugSeguro}-${dia}-${mes}-audio.mp3`;

    const arquivoDrive =
      await salvarArquivoDrive({
        folderId:
          pasta.clientFolderId,
        nomeArquivo,
        mimeType: "audio/mpeg",
        buffer: audio,
      });

    if (!arquivoDrive.id) {
      throw new Error(
        "O áudio foi enviado ao Drive, mas o ID do arquivo não foi retornado."
      );
    }

    const {
      data: cliente,
      error: clienteError,
    } = await supabaseAdmin
      .from("club_clients")
      .select("id,slug")
      .eq("slug", slug)
      .maybeSingle();

    if (clienteError) {
      throw clienteError;
    }

    if (!cliente?.id) {
      throw new Error(
        `Assinante com slug "${slug}" não encontrada no Supabase.`
      );
    }

     const agora =
  new Date().toISOString();

const driveFileUrl =
  `https://drive.google.com/file/d/${arquivoDrive.id}/view`;

    // Ao gerar novamente, toda a semana volta para rascunho.
    const { error: resetError } = await supabaseAdmin
      .from("club_directional_assets")
      .update({
        ativo: false,
        released_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("client_id", cliente.id)
      .eq("ano", pasta.ano)
      .eq("mes", pasta.mes)
      .eq("semana", String(semana))
      .in("tipo", ["pdf_individual", "audio_individual"]);

    if (resetError) {
      throw resetError;
    }

// Todo áudio gerado fica como rascunho até a liberação manual.
const ativo = false;
const releasedAt = null;

const {
  error: assetError,
} = await supabaseAdmin
  .from(
    "club_directional_assets"
  )
  .upsert(
    {
      client_id: cliente.id,
      slug,
      ano: pasta.ano,
      mes: pasta.mes,
      semana: String(semana),
      tipo: "audio_individual",
      titulo:
        `${semana}ª Semana — Áudio`,
      drive_file_id:
        arquivoDrive.id,
      drive_file_url:
        driveFileUrl,
      drive_folder_id:
        pasta.clientFolderId,

      // NOVO conteúdo fica oculto
      ativo,

      // Só possui data se já estava liberado
      released_at: releasedAt,

      updated_at: agora,
    },
    {
      onConflict:
        "client_id,ano,mes,semana,tipo",
    }
  );

    if (assetError) {
      throw assetError;
    }

    console.log(
      "Áudio salvo no Drive e registrado no portal:",
      {
        nome: nomeArquivo,
        fileId: arquivoDrive.id,
        pasta:
          pasta.clientFolderId,
        clientId: cliente.id,
        semana,
      }
    );

    return new Response(
      new Uint8Array(audio),
      {
        status: 200,
        headers: {
          "Content-Type":
            "audio/mpeg",
          "Content-Disposition":
            `attachment; filename="${nomeArquivo}"`,
          "Cache-Control":
            "no-store",
          "X-Drive-File-Id":
            arquivoDrive.id,
          "X-Drive-File-Name":
            nomeArquivo,
          "X-Portal-Registered":
            "true",
        },
      }
    );
  } catch (error) {
    console.error(
      "Erro ao gerar áudio:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao gerar áudio.",
      },
      { status: 500 }
    );
  }
}
