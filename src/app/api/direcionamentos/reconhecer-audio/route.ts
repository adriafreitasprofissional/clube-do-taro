import { NextResponse } from "next/server";
import {
  garantirPastaAssinante,
  getDriveClient,
} from "@/lib/google-drive";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearerToken(req: Request) {
  const auth = req.headers.get("authorization") || "";

  return auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : "";
}

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

function escaparQuery(valor: string) {
  return valor
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}

export async function POST(req: Request) {
  try {
    const token = bearerToken(req);

    if (!token) {
      return NextResponse.json(
        { error: "Nao autorizado." },
        { status: 401 }
      );
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.getUser(token);

    if (authError || !authData.user?.email) {
      return NextResponse.json(
        { error: "Nao autorizado." },
        { status: 401 }
      );
    }

    const { data: operador, error: operadorError } =
      await supabaseAdmin
        .from("club_clients")
        .select("id,email,role,status")
        .eq("email", authData.user.email)
        .maybeSingle();

    if (
      operadorError ||
      !operador ||
      !["admin", "profissional"].includes(
        operador.role
      )
    ) {
      return NextResponse.json(
        { error: "Acesso negado." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const slug =
      String(body?.slug || "").trim();

    const dataInicio =
      String(body?.dataInicio || "").trim();

    const dataFim =
      String(body?.dataFim || "").trim();

    if (!slug || !dataInicio) {
      return NextResponse.json(
        {
          error:
            "Consulente ou periodo nao informado.",
        },
        { status: 400 }
      );
    }

    const { data: cliente, error: clienteError } =
      await supabaseAdmin
        .from("club_clients")
        .select("id,slug,professional_id")
        .ilike("slug", slug)
        .maybeSingle();

    if (clienteError) {
      throw clienteError;
    }

    if (!cliente?.id) {
      return NextResponse.json(
        {
          error:
            "Consulente nao encontrado.",
        },
        { status: 404 }
      );
    }

    if (
      operador.role === "profissional" &&
      cliente.professional_id !== operador.id
    ) {
      return NextResponse.json(
        {
          error:
            "Acesso negado a este consulente.",
        },
        { status: 403 }
      );
    }

    const dataInicial =
      new Date(`${dataInicio}T12:00:00`);

    if (Number.isNaN(dataInicial.getTime())) {
      return NextResponse.json(
        { error: "Data inicial invalida." },
        { status: 400 }
      );
    }

    const dataFinal = dataFim
      ? new Date(`${dataFim}T12:00:00`)
      : new Date(dataInicial);

    if (!dataFim) {
      dataFinal.setDate(
        dataFinal.getDate() + 6
      );
    }

    const diferencaDias = Math.round(
      (
        dataFinal.getTime() -
        dataInicial.getTime()
      ) / 86400000
    );

    const data = new Date(dataInicial);

    data.setDate(
      data.getDate() +
        Math.floor(diferencaDias / 2)
    );

    const semana =
      numeroSemanaDoMes(data);

    const pasta =
      await garantirPastaAssinante({
        slug,
        data,
      });

    const slugSeguro = slug
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const inicioNome =
      `semana-${semana}-${slugSeguro}-`;

    const drive = getDriveClient();

    const encontrados =
      await drive.files.list({
        q: [
          `'${pasta.clientFolderId}' in parents`,
          `name contains '${escaparQuery(inicioNome)}'`,
          `name contains '-audio.mp3'`,
          "trashed = false",
        ].join(" and "),
        fields:
          "files(id,name,webViewLink,modifiedTime)",
        orderBy: "modifiedTime desc",
        pageSize: 20,
      });

    const audio =
      encontrados.data.files?.[0];

    if (!audio?.id) {
      return NextResponse.json(
        {
          error:
            "Nenhum MP3 desta semana foi encontrado na pasta da consulente.",
        },
        { status: 404 }
      );
    }

    const agora =
      new Date().toISOString();

    const { error: salvarError } =
      await supabaseAdmin
        .from("club_directional_assets")
        .upsert(
          {
            client_id: cliente.id,
            slug: cliente.slug || slug,
            ano: pasta.ano,
            mes: pasta.mes,
            semana: String(semana),
            tipo: "audio_individual",
            titulo:
              `${semana}a Semana - Audio`,
            drive_file_id: audio.id,
            drive_file_url:
              audio.webViewLink ||
              `https://drive.google.com/file/d/${audio.id}/view`,
            drive_folder_id:
              pasta.clientFolderId,
            ativo: false,
            released_at: null,
            updated_at: agora,
          },
          {
            onConflict:
              "client_id,ano,mes,semana,tipo",
          }
        );

    if (salvarError) {
      throw salvarError;
    }

    return NextResponse.json({
      ok: true,
      reconhecido: true,
      nomeArquivo: audio.name,
      fileId: audio.id,
    });
  } catch (error) {
    console.error(
      "Erro ao reconhecer audio do Drive:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao reconhecer audio.",
      },
      { status: 500 }
    );
  }
}