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
  genero = "",
  senha: senhaInicial,
  dataInicio = new Date().toISOString().slice(0, 10),
} = body;

let senha = senhaInicial;

if (!senha) {
  senha = crypto.randomUUID().replace(/-/g, "").substring(0, 8);
}

    // 1. Gerar o slug
    const slug = nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");

    // 2. Criar o usuário no Auth
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: senha,
        email_confirm: true,
        user_metadata: {
          display_name: nome,
        },
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const authId = authUser.user?.id;

    // 3. Inserir na tabela vinculando ao ID do Auth (Melhor Prática)
    // Se você quer que o ID da tabela seja o ID principal, passamos ele aqui.
    const { data: cliente, error: clientError } = await supabaseAdmin
  .from("club_clients")
  .insert({
    id: authId,
    nome,
    email,
    whatsapp,
    plano,
    genero,
    senha_inicial: senha,
    data_inicio: dataInicio,
    slug,
    status: "Ativo",
  })
  .select()
  .single();

    if (clientError) {
      // Se der erro na tabela, idealmente você deveria deletar o usuário do Auth criado acima
      return NextResponse.json({ error: clientError.message }, { status: 400 });
    }

    // 4. Agora pegamos o ID que veio da TABELA (que agora é igual ao Auth)
    const clienteId = cliente.id; 

    console.log("CLIENTE ID DA TABELA:", clienteId);

    const meses = [
      "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
    ];

    // 5. Criar estrutura no Storage usando o ID DA TABELA
    for (const mes of meses) {
      const { error } = await supabaseAdmin.storage
        .from("clientes")
        .upload(
          `${clienteId}/clube-do-taro/2026/${mes}/.keep`,
          Buffer.from("criado"),
          { upsert: true }
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
      userId: clienteId, // Retornamos o ID da tabela
    });
  } catch (error) {
    console.error("ERRO GERAL:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
