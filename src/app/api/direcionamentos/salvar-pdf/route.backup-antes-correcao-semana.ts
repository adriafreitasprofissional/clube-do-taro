import { NextResponse } from "next/server";
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
    const formData = await req.formData();

    const arquivo = formData.get("arquivo");
    const slug = String(
      formData.get("slug") || ""
    ).trim();

    const dataInicio = String(
      formData.get("dataInicio") || ""
    ).trim();

    if (!arquivo || typeof arquivo === "string") {
      return NextResponse.json(
        { error: "PDF não informado." },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Assinante não informada." },
        { status: 400 }
      );
    }

    if (!dataInicio) {
      return NextResponse.json(
        {
          error:
            "Data inicial da semana não informada.",
        },
        { status: 400 }
      );
    }

    const data = new Date(
      `${dataInicio}T12:00:00`
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
  `semana-${semana}-${slugSeguro}-${dia}-${mes}.pdf`;

    const arrayBuffer =
      await arquivo.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    const arquivoDrive =
      await salvarArquivoDrive({
        folderId:
          pasta.clientFolderId,
        nomeArquivo,
        mimeType:
          "application/pdf",
        buffer,
      });

    if (!arquivoDrive.id) {
      throw new Error(
        "O PDF foi enviado ao Drive, mas o ID do arquivo não foi retornado."
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
        `Assinante com slug "${slug}" não encontrada.`
      );
    }

    const {
      data: assetExistente,
      error: assetExistenteError,
    } = await supabaseAdmin
      .from("club_directional_assets")
      .select("ativo,released_at")
      .eq("client_id", cliente.id)
      .eq("ano", pasta.ano)
      .eq("mes", pasta.mes)
      .eq("semana", String(semana))
      .eq("tipo", "pdf_individual")
      .maybeSingle();

    if (assetExistenteError) {
      throw assetExistenteError;
    }

    const ativo =
      assetExistente
        ? Boolean(assetExistente.ativo)
        : false;

    const releasedAt =
      assetExistente?.released_at ||
      null;

    const agora =
      new Date().toISOString();

    const driveFileUrl =
      `https://drive.google.com/file/d/${arquivoDrive.id}/view`;

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
          tipo: "pdf_individual",
          titulo:
            `${semana}ª Semana — PDF`,
          drive_file_id:
            arquivoDrive.id,
          drive_file_url:
            driveFileUrl,
          drive_folder_id:
            pasta.clientFolderId,
          ativo,
          released_at:
            releasedAt,
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

    return NextResponse.json({
      success: true,
      nomeArquivo,
      driveFileId:
        arquivoDrive.id,
      ativo,
      released_at:
        releasedAt,
    });
  } catch (error) {
    console.error(
      "Erro ao salvar PDF:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao salvar PDF.",
      },
      { status: 500 }
    );
  }
}