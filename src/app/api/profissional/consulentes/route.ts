import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { garantirPastaAssinante } from "@/lib/google-drive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearerToken(req: Request) {
  const authorization =
    req.headers.get("authorization") || "";

  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

function slugSeguro(valor: string) {
  return valor
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

async function obterProfissional(req: Request) {
  const token = bearerToken(req);

  if (!token) {
    return {
      profissional: null,
      error: "Acesso não autorizado.",
      status: 401,
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user?.email) {
    return {
      profissional: null,
      error: "Sessão inválida. Entre novamente.",
      status: 401,
    };
  }

  const {
    data: profissional,
    error: profissionalError,
  } = await supabaseAdmin
    .from("club_clients")
    .select(
      "id,nome,email,slug,role,plano,status"
    )
    .ilike("email", user.email)
    .eq("role", "profissional")
    .maybeSingle();

  if (
    profissionalError ||
    !profissional ||
    profissional.status !== "ativo"
  ) {
    return {
      profissional: null,
      error: "Este usuário não possui acesso profissional ativo.",
      status: 403,
    };
  }

  return {
    profissional,
    error: null,
    status: 200,
  };
}

export async function GET(req: Request) {
  try {
    const auth = await obterProfissional(req);

    if (!auth.profissional) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("club_clients")
      .select(
        "id,nome,nome_referencia,email,whatsapp,slug,status,plano"
      )
      .eq(
        "professional_id",
        auth.profissional.id
      )
      .order("nome", {
        ascending: true,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      profissional: {
        id: auth.profissional.id,
        nome: auth.profissional.nome,
        plano: auth.profissional.plano,
      },
      limite: 10,
      total: data?.length || 0,
      consulentes: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  let authId: string | null = null;

  try {
    const auth = await obterProfissional(req);

    if (!auth.profissional) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const body = await req.json();

    const nome =
      String(body.nome || "").trim();

    const nomeReferencia =
      String(
        body.nomeReferencia ||
          body.nome_referencia ||
          nome
      ).trim();

    const email =
      String(body.email || "")
        .trim()
        .toLowerCase();

    const whatsapp =
      String(body.whatsapp || "").trim();

    if (!nome || !email) {
      return NextResponse.json(
        {
          error:
            "Nome e e-mail são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const {
      count,
      error: countError,
    } = await supabaseAdmin
      .from("club_clients")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq(
        "professional_id",
        auth.profissional.id
      )
      .eq("status", "ativo");

    if (countError) {
      return NextResponse.json(
        { error: countError.message },
        { status: 400 }
      );
    }

    if ((count || 0) >= 10) {
      return NextResponse.json(
        {
          error:
            "Você atingiu o limite de 10 consulentes ativos do Plano Fundador. Para cadastrar novos consulentes, faça upgrade do seu plano.",
        },
        { status: 403 }
      );
    }

    const {
      data: existente,
    } = await supabaseAdmin
      .from("club_clients")
      .select(
        "id,nome,email,professional_id"
      )
      .ilike("email", email)
      .maybeSingle();

    if (existente) {
      return NextResponse.json(
        {
          error:
            "Já existe um cadastro com este e-mail.",
        },
        { status: 409 }
      );
    }

    let slug = slugSeguro(nome);

    if (!slug) {
      slug = `consulente-${Date.now()}`;
    }

    const {
      data: slugExistente,
    } = await supabaseAdmin
      .from("club_clients")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (slugExistente) {
      slug =
        `${slug}-${crypto.randomUUID().slice(0, 4)}`;
    }

    const senhaTemporaria =
      crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 10);

    const {
      data: authUser,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: senhaTemporaria,
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

    authId = authUser.user?.id || null;

    if (!authId) {
      return NextResponse.json(
        {
          error:
            "Não foi possível criar o acesso do consulente.",
        },
        { status: 400 }
      );
    }

    const {
      data: cliente,
      error: clienteError,
    } = await supabaseAdmin
      .from("club_clients")
      .insert({
        id: authId,
        nome,
        nome_referencia: nomeReferencia,
        email,
        whatsapp,
        plano: "bronze",
        status: "ativo",
        slug,
        role: "cliente",
        tipo_assinatura:
          "consulente_profissional",
        produto: "Clube do Tarô",
        acesso_app: true,
        direcionamento_exclusivo: true,
        senha_inicial: senhaTemporaria,
        data_inicio:
          new Date()
            .toISOString()
            .slice(0, 10),
        professional_id:
          auth.profissional.id,
      })
      .select(
        "id,nome,nome_referencia,email,whatsapp,slug,status,professional_id"
      )
      .single();

    if (clienteError) {
      await supabaseAdmin
        .auth
        .admin
        .deleteUser(authId);

      return NextResponse.json(
        { error: clienteError.message },
        { status: 400 }
      );
    }

    try {
      const pasta =
        await garantirPastaAssinante({
          slug,
          data: new Date(),
        });

      await supabaseAdmin
        .from(
          "club_client_drive_folders"
        )
        .upsert(
          {
            client_id: cliente.id,
            year:
              new Date().getFullYear(),
            month:
              new Date().getMonth() + 1,
            drive_folder_id:
              pasta.clientFolderId,
            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict:
              "client_id,year,month",
          }
        );
    } catch (driveError) {
      console.error(
        "Erro ao criar pasta do consulente:",
        driveError
      );
    }

    const { error: emailError } =
      await supabaseAdmin.auth
        .resetPasswordForEmail(
          email,
          {
            redirectTo:
              "https://www.magiaoriente.com.br/auth/reset-password",
          }
        );

    if (emailError) {
      console.error(
        "Erro ao enviar e-mail:",
        emailError
      );
    }

    return NextResponse.json({
      success: true,
      consulente: cliente,
      limite: 10,
      utilizados: (count || 0) + 1,
    });
  } catch (error) {
    if (authId) {
      try {
        await supabaseAdmin
          .auth
          .admin
          .deleteUser(authId);
      } catch {}
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
