import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const slug = (searchParams.get("slug") || "")
      .toLowerCase()
      .trim();

    if (!slug) {
      return NextResponse.json(
        {
          error: "Slug da assinante não informado.",
        },
        {
          status: 400,
        }
      );
    }

    const authorization =
      request.headers.get("authorization");

    const token = authorization?.startsWith(
      "Bearer "
    )
      ? authorization.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        {
          error: "Sessão não encontrada.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: usuario,
      error: usuarioError,
    } = await supabaseAdmin.auth.getUser(
      token
    );

    if (
      usuarioError ||
      !usuario?.user
    ) {
      return NextResponse.json(
        {
          error: "Sessão inválida.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: cliente,
      error: clienteError,
    } = await supabaseAdmin
      .from("club_clients")
      .select(
        `
        id,
        slug,
        nome
      `
      )
      .eq("slug", slug)
      .maybeSingle();

    if (clienteError) {
      throw clienteError;
    }

    if (!cliente) {
      return NextResponse.json(
        {
          error: "Assinante não encontrada.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      cliente.id !== usuario.user.id
    ) {
      return NextResponse.json(
        {
          error:
            "Você não tem acesso a estes direcionamentos.",
        },
        {
          status: 403,
        }
      );
    }

    const {
      data: conteudos,
      error: conteudosError,
    } = await supabaseAdmin
      .from(
        "club_directional_assets"
      )
      .select(
        `
        id,
        client_id,
        slug,
        ano,
        mes,
        semana,
        tipo,
        titulo,
        drive_file_id,
        drive_file_url,
        drive_folder_id,
        ativo,
        released_at,
        created_at
      `
      )
      .eq(
        "client_id",
        cliente.id
      )
      .eq("ativo", true)
      .order("ano", {
        ascending: false,
      })
      .order("created_at", {
        ascending: true,
      });

    if (conteudosError) {
      throw conteudosError;
    }

    const agora = Date.now();

    const resposta = (
      conteudos || []
    )
      .filter((item) => {
        if (!item.released_at) {
          return true;
        }

        const liberacao =
          new Date(
            item.released_at
          ).getTime();

        return liberacao <= agora;
      })
      .map((item) => ({
        id: item.id,

        slug: (
          item.slug || slug
        )
          .toLowerCase()
          .trim(),

        ano: String(
          item.ano || ""
        ).trim(),

        mes: String(
          item.mes || ""
        )
          .toLowerCase()
          .trim(),

        semana: String(
          item.semana || ""
        ).trim(),

        tipo: String(
          item.tipo || ""
        )
          .toLowerCase()
          .trim(),

        titulo:
          item.titulo || "",

        drive_file_id:
          item.drive_file_id ||
          null,

        drive_file_url:
          item.drive_file_url ||
          null,

        drive_folder_id:
          item.drive_folder_id ||
          null,

        ativo: "sim",
      }));

    return NextResponse.json(
      {
        success: true,
        cliente: {
          id: cliente.id,
          slug: cliente.slug,
          nome: cliente.nome,
        },
        conteudos: resposta,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Erro ao carregar conteúdos dos direcionamentos:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao carregar direcionamentos.",
      },
      {
        status: 500,
      }
    );
  }
}