import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Sessão não encontrada." },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Sessão inválida." },
        { status: 401 }
      );
    }

    const {
      cliente_id,
      nome_cliente,
      email_cliente,
      plano,
      categoria,
      pergunta,
      urgente,
      referencia_mes,
    } = await request.json();

    if (!cliente_id || !pergunta?.trim()) {
      return NextResponse.json(
        { error: "Dados da pergunta incompletos." },
        { status: 400 }
      );
    }

   const {
  data: cliente,
  error: clienteError,
} = await supabaseAdmin
  .from("club_clients")
  .select("id,email")
  .eq("id", cliente_id)
  .maybeSingle();

if (clienteError) {
  throw clienteError;
}

if (!cliente) {
  return NextResponse.json(
    { error: "Assinante não encontrada." },
    { status: 404 }
  );
}

const emailUsuario = String(
  user.email || ""
)
  .toLowerCase()
  .trim();

const emailCliente = String(
  cliente.email || ""
)
  .toLowerCase()
  .trim();

const ehPropriaAssinante =
  user.id === cliente.id ||
  (
    emailUsuario &&
    emailCliente &&
    emailUsuario === emailCliente
  );

if (!ehPropriaAssinante) {
  return NextResponse.json(
    {
      error:
        "Este acesso não pertence a esta assinante.",
    },
    { status: 403 }
  );
}

    const { data, error } = await supabaseAdmin
      .from("exclusive_questions")
      .insert({
        cliente_id,
        nome_cliente,
        email_cliente: email_cliente || null,
        plano,
        categoria,
        pergunta: pergunta.trim(),
        status: "Nova pergunta",
        urgente: Boolean(urgente),
        referencia_mes,
        ativo: true,
        processada: false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      pergunta: data,
    });
  } catch (error) {
    console.error("Erro ao salvar pergunta:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao salvar pergunta.",
      },
      { status: 500 }
    );
  }
}