import { NextResponse } from "next/server";
import {
  garantirPastaAssinante,
  getDriveClient,
} from "@/lib/google-drive";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearerToken(req: Request) {
  const auth =
    req.headers.get("authorization") || "";

  return auth
    .toLowerCase()
    .startsWith("bearer ")
    ? auth.slice(7).trim()
    : "";
}

function numeroSemanaDoMes(data: Date) {
  const primeiroDia =
    new Date(
      data.getFullYear(),
      data.getMonth(),
      1
    );

  const diaSemanaPrimeiro =
    (primeiroDia.getDay() + 6) % 7;

  return Math.ceil(
    (
      data.getDate() +
      diaSemanaPrimeiro
    ) / 7
  );
}

function obterSegundaFeira(data: Date) {
  const segunda =
    new Date(data);

  const diaSemana =
    segunda.getDay();

  const diferenca =
    diaSemana === 0
      ? -6
      : 1 - diaSemana;

  segunda.setDate(
    segunda.getDate() +
      diferenca
  );

  segunda.setHours(
    12,
    0,
    0,
    0
  );

  return segunda;
}

export async function POST(
  req: Request
) {
  try {
    const token =
      bearerToken(req);

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Não autorizado.",
        },
        { status: 401 }
      );
    }

    const {
      data: authData,
      error: authError,
    } =
      await supabaseAdmin.auth.getUser(
        token
      );

    if (
      authError ||
      !authData.user?.email
    ) {
      return NextResponse.json(
        {
          error:
            "Não autorizado.",
        },
        { status: 401 }
      );
    }

    const {
      data: operador,
      error: operadorError,
    } =
      await supabaseAdmin
        .from("club_clients")
        .select(
          "id,email,role,status"
        )
        .eq(
          "email",
          authData.user.email
        )
        .maybeSingle();

    if (
      operadorError ||
      !operador ||
      ![
        "admin",
        "profissional",
      ].includes(
        operador.role
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Acesso negado.",
        },
        { status: 403 }
      );
    }

    const body =
      await req.json();

    const slug =
      String(
        body?.slug || ""
      ).trim();

    const dataInicio =
      String(
        body?.dataInicio || ""
      ).trim();

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Consulente sem slug.",
        },
        { status: 400 }
      );
    }

    if (!dataInicio) {
      return NextResponse.json(
        {
          error:
            "Data da semana não informada.",
        },
        { status: 400 }
      );
    }

    const {
      data: cliente,
      error: clienteError,
    } =
      await supabaseAdmin
        .from("club_clients")
        .select(
          "id,slug,professional_id"
        )
        .ilike(
          "slug",
          slug
        )
        .maybeSingle();

    if (clienteError) {
      throw clienteError;
    }

    if (!cliente?.id) {
      return NextResponse.json(
        {
          error:
            "Consulente não encontrado.",
        },
        { status: 404 }
      );
    }

    if (
      operador.role ===
        "profissional" &&
      cliente.professional_id !==
        operador.id
    ) {
      return NextResponse.json(
        {
          error:
            "Acesso negado a este consulente.",
        },
        { status: 403 }
      );
    }

    const dataRecebida =
      new Date(
        `${dataInicio}T12:00:00`
      );

    if (
      Number.isNaN(
        dataRecebida.getTime()
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Data inicial inválida.",
        },
        { status: 400 }
      );
    }

    /*
      REGRA OFICIAL:
      toda semana pertence
      à segunda-feira.
    */
    const data =
      obterSegundaFeira(
        dataRecebida
      );

    const semana =
      numeroSemanaDoMes(data);

    const pasta =
      await garantirPastaAssinante({
        slug,
        data,
      });

    const dia =
      String(
        data.getDate()
      ).padStart(
        2,
        "0"
      );

    const mesNumero =
      String(
        data.getMonth() + 1
      ).padStart(
        2,
        "0"
      );

    const slugSeguro =
      slug
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
        .replace(
          /^-|-$/g,
          ""
        );

    const prefixo =
      `semana-${semana}-${slugSeguro}-`;

    const nomePdfEsperado =
      `${prefixo}${dia}-${mesNumero}.pdf`;

    const nomeAudioEsperado =
      `${prefixo}${dia}-${mesNumero}-audio.mp3`;

    const drive =
      getDriveClient();

    /*
      Procuramos todos os arquivos
      da pasta da cliente.

      modifiedTime desc garante que,
      se houver mais de um,
      usamos o mais recente.
    */
    const respostaDrive =
      await drive.files.list({
        q: [
          `'${pasta.clientFolderId}' in parents`,
          "trashed = false",
        ].join(" and "),

        fields:
          "files(id,name,mimeType,modifiedTime)",

        orderBy:
          "modifiedTime desc",

        pageSize: 100,
      });

    const arquivos =
      respostaDrive.data.files || [];

    /*
      1º tenta o nome correto
      com a segunda-feira.

      2º usa um fallback:
      mesma semana + mesma cliente
      + mesmo tipo.

      Esse fallback resgata,
      por exemplo, o áudio que
      acabou sendo criado com 07-10.
    */
    const pdf =
      arquivos.find(
        (arquivo) =>
          arquivo.name ===
          nomePdfEsperado
      ) ||
      arquivos.find(
        (arquivo) =>
          !!arquivo.name &&
          arquivo.name.startsWith(
            prefixo
          ) &&
          arquivo.name
            .toLowerCase()
            .endsWith(".pdf")
      );

    const audio =
      arquivos.find(
        (arquivo) =>
          arquivo.name ===
          nomeAudioEsperado
      ) ||
      arquivos.find(
        (arquivo) =>
          !!arquivo.name &&
          arquivo.name.startsWith(
            prefixo
          ) &&
          (
            arquivo.name
              .toLowerCase()
              .endsWith(
                "-audio.mp3"
              ) ||
            arquivo.name
              .toLowerCase()
              .endsWith(".mp3") ||
            arquivo.mimeType ===
              "audio/mpeg"
          )
      );

    const agora =
      new Date()
        .toISOString();

    /*
      Antes de registrar,
      verificamos se já existiam
      os assets.

      Assim não desativamos
      acidentalmente algo que
      já tenha sido liberado.
    */
    const {
      data: existentes,
      error:
        existentesError,
    } =
      await supabaseAdmin
        .from(
          "club_directional_assets"
        )
        .select(
          "tipo,ativo,released_at"
        )
        .eq(
          "client_id",
          cliente.id
        )
        .eq(
          "ano",
          pasta.ano
        )
        .eq(
          "mes",
          pasta.mes
        )
        .eq(
          "semana",
          String(semana)
        )
        .in(
          "tipo",
          [
            "pdf_individual",
            "audio_individual",
          ]
        );

    if (
      existentesError
    ) {
      throw existentesError;
    }

    const pdfExistente =
      existentes?.find(
        (item) =>
          item.tipo ===
          "pdf_individual"
      );

    const audioExistente =
      existentes?.find(
        (item) =>
          item.tipo ===
          "audio_individual"
      );

    if (
      pdf?.id
    ) {
      const {
        error: pdfError,
      } =
        await supabaseAdmin
          .from(
            "club_directional_assets"
          )
          .upsert(
            {
              client_id:
                cliente.id,

              slug,

              ano:
                pasta.ano,

              mes:
                pasta.mes,

              semana:
                String(
                  semana
                ),

              tipo:
                "pdf_individual",

              titulo:
                `${semana}ª Semana — PDF`,

              drive_file_id:
                pdf.id,

              drive_file_url:
                `https://drive.google.com/file/d/${pdf.id}/view`,

              drive_folder_id:
                pasta.clientFolderId,

              ativo:
                pdfExistente?.ativo ??
                false,

              released_at:
                pdfExistente?.released_at ??
                null,

              updated_at:
                agora,
            },
            {
              onConflict:
                "client_id,ano,mes,semana,tipo",
            }
          );

      if (
        pdfError
      ) {
        throw pdfError;
      }
    }

    if (
      audio?.id
    ) {
      const {
        error: audioError,
      } =
        await supabaseAdmin
          .from(
            "club_directional_assets"
          )
          .upsert(
            {
              client_id:
                cliente.id,

              slug,

              ano:
                pasta.ano,

              mes:
                pasta.mes,

              semana:
                String(
                  semana
                ),

              tipo:
                "audio_individual",

              titulo:
                `${semana}ª Semana — Áudio`,

              drive_file_id:
                audio.id,

              drive_file_url:
                `https://drive.google.com/file/d/${audio.id}/view`,

              drive_folder_id:
                pasta.clientFolderId,

              ativo:
                audioExistente?.ativo ??
                false,

              released_at:
                audioExistente?.released_at ??
                null,

              updated_at:
                agora,
            },
            {
              onConflict:
                "client_id,ano,mes,semana,tipo",
            }
          );

      if (
        audioError
      ) {
        throw audioError;
      }
    }

    const pdfPronto =
      Boolean(pdf?.id);

    const audioPronto =
      Boolean(audio?.id);

    return NextResponse.json({
      ok: true,

      semana:
        String(semana),

      dataSemana:
        `${data.getFullYear()}-${mesNumero}-${dia}`,

      pdfPronto,

      audioPronto,

      prontoParaLiberar:
        pdfPronto &&
        audioPronto,

      pdf: pdf?.id
        ? {
            id: pdf.id,
            nome:
              pdf.name,
          }
        : null,

      audio: audio?.id
        ? {
            id: audio.id,
            nome:
              audio.name,
          }
        : null,

      mensagem:
        pdfPronto &&
        audioPronto
          ? "PDF e áudio encontrados no Google Drive e registrados no sistema."
          : pdfPronto
          ? "PDF encontrado. Áudio ainda não encontrado."
          : audioPronto
          ? "Áudio encontrado. PDF ainda não encontrado."
          : "PDF e áudio ainda não foram encontrados na pasta desta semana.",
    });
  } catch (error) {
    console.error(
      "Erro ao verificar arquivos do direcionamento:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao verificar PDF e áudio.",
      },
      { status: 500 }
    );
  }
}