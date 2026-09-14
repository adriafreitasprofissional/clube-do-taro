import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const PLANILHA_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSr7qra9Jsh2IO6vDO_8vVxe-8lkf9zbFeuDPtw5Wny7zHUKIhVa7lIqqshLo_4JbRDUhWjv0sb_5y3/pub?gid=0&single=true&output=csv";

function lerCsv(linha: string) {
  const valores: string[] = [];

  let atual = "";
  let dentroAspas = false;

  for (
    let i = 0;
    i < linha.length;
    i++
  ) {
    const caractere = linha[i];

    if (caractere === '"') {
      if (
        dentroAspas &&
        linha[i + 1] === '"'
      ) {
        atual += '"';
        i++;
      } else {
        dentroAspas =
          !dentroAspas;
      }

      continue;
    }

    if (
      caractere === "," &&
      !dentroAspas
    ) {
      valores.push(atual);
      atual = "";
      continue;
    }

    atual += caractere;
  }

  valores.push(atual);

  return valores;
}

function extrairDriveFileId(
  valor: string
) {
  const texto = valor.trim();

  if (!texto) {
    return null;
  }

  if (
    /^[A-Za-z0-9_-]{20,}$/.test(
      texto
    )
  ) {
    return texto;
  }

  const porD = texto.match(
    /\/d\/([A-Za-z0-9_-]+)/
  );

  if (porD?.[1]) {
    return porD[1];
  }

  const porId = texto.match(
    /[?&]id=([A-Za-z0-9_-]+)/
  );

  if (porId?.[1]) {
    return porId[1];
  }

  return null;
}

export async function GET() {
  try {
    // Esta rota serve apenas para a
    // migração local, uma única vez.
    if (
      process.env.NODE_ENV ===
      "production"
    ) {
      return NextResponse.json(
        {
          error:
            "Migração desabilitada em produção.",
        },
        {
          status: 404,
        }
      );
    }

    const resposta =
      await fetch(PLANILHA_CSV, {
        cache: "no-store",
      });

    if (!resposta.ok) {
      throw new Error(
        "Não foi possível carregar a planilha."
      );
    }

    const texto =
      await resposta.text();

    const linhas = texto
      .split(/\r?\n/)
      .map((linha) => linha.trim())
      .filter(Boolean);

    if (linhas.length < 2) {
      return NextResponse.json({
        success: true,
        importados: 0,
        mensagem:
          "A planilha não possui registros.",
      });
    }

    const cabecalho =
      lerCsv(linhas[0]).map(
        (item) =>
          item
            .toLowerCase()
            .trim()
      );

    const {
      data: clientes,
      error: clientesError,
    } = await supabaseAdmin
      .from("club_clients")
      .select("id, slug");

    if (clientesError) {
      throw clientesError;
    }

    const clientesPorSlug =
      new Map<string, string>();

    for (
      const cliente of clientes || []
    ) {
      if (!cliente.slug) {
        continue;
      }

      clientesPorSlug.set(
        cliente.slug
          .toLowerCase()
          .trim(),
        cliente.id
      );
    }

    const registros =
      new Map<string, any>();

    const slugsNaoEncontrados =
      new Set<string>();

    let ignorados = 0;

    for (
      const linha of linhas.slice(1)
    ) {
      const valores =
        lerCsv(linha);

      const item: Record<
        string,
        string
      > = {};

      cabecalho.forEach(
        (coluna, indice) => {
          item[coluna] =
            valores[indice] || "";
        }
      );

      const slug = (
        item.slug || ""
      )
        .toLowerCase()
        .trim();

      const ano = (
        item.ano || ""
      ).trim();

      const mes = (
        item.mes || ""
      )
        .toLowerCase()
        .trim();

      const semana = (
        item.semana || ""
      ).trim();

      const tipo = (
        item.tipo || ""
      )
        .toLowerCase()
        .trim();

      const titulo = (
        item.titulo || ""
      ).trim();

      const driveFile = (
        item.drive_file || ""
      ).trim();

      const ativo = (
        item.ativo || ""
      )
        .toLowerCase()
        .trim();

      if (
        !slug ||
        !ano ||
        !mes ||
        !semana ||
        !tipo ||
        !driveFile ||
        ativo !== "sim"
      ) {
        ignorados++;
        continue;
      }

      const clientId =
        clientesPorSlug.get(slug);

      if (!clientId) {
        slugsNaoEncontrados.add(
          slug
        );
        ignorados++;
        continue;
      }

      if (
        tipo !==
          "audio_individual" &&
        tipo !==
          "pdf_individual"
      ) {
        ignorados++;
        continue;
      }

      const driveFileId =
        extrairDriveFileId(
          driveFile
        );

      const driveFileUrl =
        driveFile.startsWith(
          "http"
        )
          ? driveFile
          : null;

      if (
        !driveFileId &&
        !driveFileUrl
      ) {
        ignorados++;
        continue;
      }

      const chave = [
        clientId,
        ano,
        mes,
        semana,
        tipo,
      ].join("|");

      registros.set(chave, {
        client_id: clientId,
        slug,
        ano,
        mes,
        semana,
        tipo,
        titulo:
          titulo || null,

        drive_file_id:
          driveFileId,

        drive_file_url:
          driveFileUrl,

        drive_folder_id: null,

        ativo: true,

        updated_at:
          new Date().toISOString(),
      });
    }

    const lista =
      Array.from(
        registros.values()
      );

    if (lista.length > 0) {
      const {
        error: upsertError,
      } = await supabaseAdmin
        .from(
          "club_directional_assets"
        )
        .upsert(lista, {
          onConflict:
            "client_id,ano,mes,semana,tipo",
        });

      if (upsertError) {
        throw upsertError;
      }
    }

    return NextResponse.json({
      success: true,

      importados:
        lista.length,

      ignorados,

      slugsNaoEncontrados:
        Array.from(
          slugsNaoEncontrados
        ),

      mensagem:
        "Migração concluída.",
    });
  } catch (error) {
    console.error(
      "Erro na migração dos direcionamentos:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido.",
      },
      {
        status: 500,
      }
    );
  }
}