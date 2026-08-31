import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { question_id, autor, mensagem } = body;

    if (!question_id || !autor || !mensagem?.trim()) {
      return NextResponse.json(
        {
          error:
            "question_id, autor e mensagem são obrigatórios.",
        },
        { status: 400 }
      );
    }

    // 1. Salva a mensagem enviada pelo ADM
    const { data: mensagemSalva, error: mensagemError } =
      await supabaseAdmin
        .from("exclusive_messages")
        .insert({
          question_id,
          autor,
          mensagem: mensagem.trim(),
        })
        .select()
        .single();

    if (mensagemError) {
      return NextResponse.json(
        {
          error: mensagemError.message,
        },
        { status: 500 }
      );
    }

    // 2. Se a mensagem veio do ADM,
    // coloca a pergunta aguardando reformulação da assinante
    if (autor === "admin") {
      const { error: perguntaError } =
        await supabaseAdmin
          .from("exclusive_questions")
          .update({
            status:
              "Aguardando resposta da assinante",
          })
          .eq("id", question_id);

      if (perguntaError) {
        return NextResponse.json(
          {
            error: perguntaError.message,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      mensagem: mensagemSalva,
    });
  } catch (error) {
    console.error(
      "Erro ao enviar mensagem exclusiva:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erro interno ao enviar a solicitação.",
      },
      { status: 500 }
    );
  }
}