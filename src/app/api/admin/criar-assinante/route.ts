import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

   const {
  nome,
  nomeReferencia,
  email,
  whatsapp,
  tipoAssinatura = "assinatura",
  plano,
  genero = "",
  senhaInicial,
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
  nome_referencia: nomeReferencia,
  email,
  whatsapp,
  plano: plano.toLowerCase(),
  genero,
  tipo_assinatura: tipoAssinatura,
  senha_inicial: senha,
  data_inicio: dataInicio,
  slug,
  status: "Ativo",
  produto: "Clube do Tarô",
  acesso_app: true,
  direcionamento_exclusivo: true,
})
      .select()
      .single();

    if (clientError) {
      // Se o cadastro no club_clients falhar,
      // remove também o usuário criado no Authentication.
      await supabaseAdmin.auth.admin.deleteUser(authId);

      console.error("ERRO AO CRIAR CLIENTE:", clientError);

      return NextResponse.json(
        {
          error: clientError.message,
          auth_user_removed: true,
        },
        { status: 400 }
      );
    }

    // 4. Agora pegamos o ID que veio da TABELA (que agora é igual ao Auth)
    const clienteId = cliente.id; 

    console.log("CLIENTE ID DA TABELA:", clienteId);

    // A estrutura mensal não precisa ser criada no cadastro.
// Os conteúdos da cliente serão vinculados conforme forem disponibilizados.

    return NextResponse.json({
      success: true,
      userId: clienteId, // Retornamos o ID da tabela
    });
  } catch (error) {
    console.error("ERRO GERAL:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
