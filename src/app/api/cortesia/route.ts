import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const nome = String(body.nome || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const whatsapp = String(body.whatsapp || "").trim();

    if (!nome || !email || !whatsapp) {
      return NextResponse.json(
        { error: "Nome, e-mail e WhatsApp são obrigatórios." },
        { status: 400 }
      );
    }

    /*
     * 1. Verifica se este e-mail já possui cadastro
     */
    const { data: clienteExistente, error: buscaError } =
      await supabaseAdmin
        .from("club_clients")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (buscaError) {
      console.error("Erro ao verificar cliente:", buscaError);

      return NextResponse.json(
        { error: "Não foi possível verificar seu cadastro." },
        { status: 500 }
      );
    }

    /*
     * Se já existe uma pessoa com este e-mail,
     * não criamos outro cadastro.
     */
    if (clienteExistente) {
      return NextResponse.json(
        {
          error:
            "Este e-mail já possui um acesso ao Clube do Tarô. Utilize seu login existente.",
        },
        { status: 409 }
      );
    }

    /*
     * 2. Gera uma senha inicial
     */
    const senha = crypto
      .randomUUID()
      .replace(/-/g, "")
      .substring(0, 10);

    /*
     * 3. Cria usuário no Supabase Auth
     */
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: senha,
        email_confirm: true,
        user_metadata: {
          display_name: nome,
          tipo_acesso: "cortesia",
        },
      });

    if (authError || !authData.user) {
      console.error("Erro ao criar usuário:", authError);

      return NextResponse.json(
        {
          error:
            authError?.message ||
            "Não foi possível criar seu acesso.",
        },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    /*
     * 4. Datas da cortesia
     *
     * A cortesia começa hoje e dura 30 dias.
     */
    const dataInicio = new Date();

    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataFim.getDate() + 30);

    /*
     * 5. Gera slug
     */
    const slugBase = nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "")
      .trim();

    const slug = `${slugBase}-${userId.substring(0, 6)}`;

    /*
     * 6. Cria cliente no Clube
     *
     * O acesso geral continua gratuito.
     * O que possui prazo é apenas o direcionamento exclusivo.
     */
    const { error: clienteError } = await supabaseAdmin
      .from("club_clients")
      .insert({
        id: userId,
        nome,
        email,
        whatsapp,
        slug,

        plano: "cortesia",

        status: "Ativo",

        tipo_assinatura: "cortesia",

        data_inicio: dataInicio.toISOString(),
        data_fim: dataFim.toISOString(),

        senha_inicial: senha,

        produto: "Clube do Tarô",

        /*
         * Campos da nova regra da cortesia.
         */
        acesso_app: true,
        direcionamento_exclusivo: true,
        data_inicio_cortesia: dataInicio.toISOString(),
        data_fim_cortesia: dataFim.toISOString(),
      })
      .select()
      .single();

    if (clienteError) {
      console.error("Erro ao criar cliente:", clienteError);

      /*
       * Se falhar a criação do cliente,
       * removemos o usuário do Auth para não deixar
       * cadastro incompleto.
       */
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return NextResponse.json(
        {
          error:
            "Não foi possível finalizar seu cadastro.",
          detalhe: clienteError.message,
        },
        { status: 500 }
      );
    }

    /*
     * 7. Resposta
     *
     * Por enquanto mandamos para o login.
     * Depois vamos substituir por uma tela de boas-vindas
     * com as credenciais e instruções do aplicativo.
     */
    return NextResponse.json({
      success: true,
      message: "Cortesia criada com sucesso.",
      redirectUrl: "/login",
      userId,
      slug,
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString(),
    });
  } catch (error) {
    console.error("ERRO API CORTESIA:", error);

    return NextResponse.json(
      {
        error: "Erro interno ao criar a cortesia.",
      },
      { status: 500 }
    );
  }
}