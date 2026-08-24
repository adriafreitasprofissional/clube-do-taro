import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function criarSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Configuração do Supabase no servidor não encontrada."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/* =========================
   BUSCAR RECADOS
========================= */

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug do cliente não informado." },
        { status: 400 }
      );
    }

    const supabaseAdmin = criarSupabaseAdmin();

    const { data: cliente, error: clienteError } =
      await supabaseAdmin
        .from("club_clients")
        .select("id, nome, slug")
        .eq("slug", slug)
        .maybeSingle();

    if (clienteError) {
      console.error(clienteError);

      return NextResponse.json(
        { error: clienteError.message },
        { status: 500 }
      );
    }

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado." },
        { status: 404 }
      );
    }

    const { data: recados, error: recadosError } =
      await supabaseAdmin
        .from("client_messages")
        .select(
          `
          id,
          client_id,
          titulo,
          mensagem,
          tipo_destino,
          publicado,
          created_at
        `
        )
        .eq("publicado", true)
        .or(`client_id.eq.${cliente.id},client_id.is.null`)
        .order("created_at", { ascending: false });

    if (recadosError) {
      console.error(recadosError);

      return NextResponse.json(
        { error: recadosError.message },
        { status: 500 }
      );
    }

    const idsDosRecados = (recados || []).map(
      (recado) => recado.id
    );

    let leituras: any[] = [];

    if (idsDosRecados.length > 0) {
      const { data: leiturasData, error: leiturasError } =
        await supabaseAdmin
          .from("client_message_reads")
          .select("message_id, client_id, lido_em")
          .eq("client_id", cliente.id)
          .in("message_id", idsDosRecados);

      if (leiturasError) {
        console.error(
          "Erro ao buscar leituras:",
          leiturasError
        );

        return NextResponse.json(
          { error: leiturasError.message },
          { status: 500 }
        );
      }

      leituras = leiturasData || [];
    }

    const recadosComLeitura = (recados || []).map(
      (recado) => {
        const leitura = leituras.find(
          (item) => item.message_id === recado.id
        );

        return {
          ...recado,
          lido: Boolean(leitura),
          lido_em: leitura?.lido_em || null,
        };
      }
    );

    return NextResponse.json({
      cliente,
      recados: recadosComLeitura,
    });
  } catch (error: any) {
    console.error("Erro na API de recados:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Erro interno ao carregar recados.",
      },
      { status: 500 }
    );
  }
}

/* =========================
   MARCAR COMO LIDO
========================= */

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const { messageId, slug } = body;

    if (!messageId || !slug) {
      return NextResponse.json(
        {
          error:
            "messageId e slug são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const supabaseAdmin = criarSupabaseAdmin();

    const { data: cliente, error: clienteError } =
      await supabaseAdmin
        .from("club_clients")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

    if (clienteError) {
      return NextResponse.json(
        { error: clienteError.message },
        { status: 500 }
      );
    }

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado." },
        { status: 404 }
      );
    }

    const { data: recado, error: recadoError } =
      await supabaseAdmin
        .from("client_messages")
        .select("id, client_id, publicado")
        .eq("id", messageId)
        .maybeSingle();

    if (recadoError) {
      return NextResponse.json(
        { error: recadoError.message },
        { status: 500 }
      );
    }

    if (!recado) {
      return NextResponse.json(
        { error: "Recado não encontrado." },
        { status: 404 }
      );
    }

    if (!recado.publicado) {
      return NextResponse.json(
        { error: "Este recado não está publicado." },
        { status: 400 }
      );
    }

    const pertenceAoCliente =
      recado.client_id === cliente.id ||
      recado.client_id === null;

    if (!pertenceAoCliente) {
      return NextResponse.json(
        { error: "Acesso ao recado não permitido." },
        { status: 403 }
      );
    }

    const { error: leituraError } =
      await supabaseAdmin
        .from("client_message_reads")
        .upsert(
          {
            message_id: messageId,
            client_id: cliente.id,
            lido_em: new Date().toISOString(),
          },
          {
            onConflict: "message_id,client_id",
          }
        );

    if (leituraError) {
      console.error(
        "Erro ao registrar leitura:",
        leituraError
      );

      return NextResponse.json(
        { error: leituraError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error(
      "Erro ao marcar recado como lido:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Erro interno ao marcar recado.",
      },
      { status: 500 }
    );
  }
}