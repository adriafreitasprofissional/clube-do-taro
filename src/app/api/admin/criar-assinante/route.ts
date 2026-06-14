import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nome,
      email,
      whatsapp,
      plano,
      genero,
      senhaInicial,
      dataInicio,
    } = body;

    const slug = nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: senhaInicial,
        email_confirm: true,
        user_metadata: {
          display_name: nome,
        },
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    const { data: cliente, error: clientError } =
  await supabaseAdmin
    .from("club_clients")
    .insert({
      nome,
      email,
      whatsapp,
      plano,
      genero,
      senha_inicial: senhaInicial,
      data_inicio: dataInicio,
      slug,
      status: "Ativo",
    })
    .select()
    .single();

    if (clientError) {
      return NextResponse.json(
        { error: clientError.message },
        { status: 400 }
      );
    }

    const clienteId = cliente.id;

    const meses = [
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];

    for (const mes of meses) {
      const { error } = await supabaseAdmin.storage
        .from("clientes")
        .upload(
  `${clienteId}/clube-do-taro/2026/${mes}/.keep`,
  Buffer.from("criado"),
  {
    upsert: true,
  }
);

      if (error) {
        console.error(`ERRO NO MÊS ${mes}:`, error);

        return NextResponse.json(
          { error: `Erro ao criar estrutura do mês ${mes}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      userId: authUser.user?.id,
    });
  } catch (error) {
    console.error("ERRO GERAL:", error);

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}