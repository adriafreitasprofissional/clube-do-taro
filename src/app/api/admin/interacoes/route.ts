import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data: interacoes, error } =
      await supabaseAdmin
        .from("client_interactions")
        .select(`
          id,
          client_id,
          source_type,
          source_id,
          interaction_type,
          message,
          admin_reply,
          replied_at,
          status,
          created_at
        `)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const clientIds = [
      ...new Set(
        (interacoes || []).map(
          (item) => item.client_id
        )
      ),
    ];

    const sourceIds = [
      ...new Set(
        (interacoes || [])
          .filter(
            (item) =>
              item.source_type === "mentoria" &&
              item.source_id
          )
          .map((item) => item.source_id)
      ),
    ];

    let clientes: {
      id: string;
      nome: string | null;
      nome_referencia: string | null;
      plano: string | null;
    }[] = [];

    let mentorias: {
      id: string;
      title: string | null;
    }[] = [];

    if (clientIds.length > 0) {
      const { data } =
        await supabaseAdmin
          .from("club_clients")
          .select(
            "id, nome, nome_referencia, plano"
          )
          .in("id", clientIds);

      clientes = data || [];
    }

    if (sourceIds.length > 0) {
      const { data } =
        await supabaseAdmin
          .from("client_service_records")
          .select("id, title")
          .in("id", sourceIds);

      mentorias = data || [];
    }

    const resultado =
      (interacoes || []).map((item) => {
        const cliente = clientes.find(
          (c) => c.id === item.client_id
        );

        const mentoria = mentorias.find(
          (m) => m.id === item.source_id
        );

        return {
          ...item,

          nome_cliente:
            cliente?.nome_referencia ||
            cliente?.nome ||
            "Assinante",

          plano:
            cliente?.plano || "",

          titulo_origem:
            mentoria?.title || "",
        };
      });

    return NextResponse.json(resultado);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar interações.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const id = String(body.id || "").trim();
    const action = String(body.action || "").trim();
    const reply = String(body.reply || "").trim();

    if (!id || !action) {
      return NextResponse.json(
        {
          error:
            "Interação e ação são obrigatórias.",
        },
        { status: 400 }
      );
    }

    if (action === "read") {
      const { error } = await supabaseAdmin
        .from("client_interactions")
        .update({
          status: "lido",
        })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    if (action === "reply") {
      if (!reply) {
        return NextResponse.json(
          {
            error: "Escreva uma resposta.",
          },
          { status: 400 }
        );
      }

      const agora = new Date().toISOString();

      const { error } = await supabaseAdmin
        .from("client_interactions")
        .update({
          admin_reply: reply,
          replied_at: agora,
          status: "respondido",
        })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    return NextResponse.json(
      { error: "Ação inválida." },
      { status: 400 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar interação.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Interação não informada.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("client_interactions")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao excluir interação.",
      },
      { status: 500 }
    );
  }
}