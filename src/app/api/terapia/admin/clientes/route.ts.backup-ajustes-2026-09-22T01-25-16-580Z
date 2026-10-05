import {
  NextRequest,
  NextResponse,
} from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTherapyAdmin } from "../_auth";

function rel(
  item: any
) {
  return Array.isArray(item)
    ? item[0] || null
    : item || null;
}

function criarSlug(
  nome: string
) {
  return nome
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-|-$/g,
      ""
    );
}

async function listarClientes(
  professional: string,
  centralAccess = false
) {
  let query =
    supabaseAdmin
      .from(
        "therapy_client_access"
      )
      .select(`
        client_id,
        active,
        professional,
        club_clients (
          id,
          nome,
          nome_referencia,
          email,
          whatsapp,
          slug
        )
      `)
      .eq("active", true);

  if (!centralAccess) {
    query =
      query.eq(
        "professional",
        professional
      );
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    throw error;
  }

  return (
    data || []
  )
    .map((item: any) => {
      const cliente =
        rel(
          item.club_clients
        );

      if (!cliente) {
        return null;
      }

      return {
        id:
          item.client_id,
        nome:
          cliente.nome_referencia ||
          cliente.nome ||
          "Cliente",
        nome_completo:
          cliente.nome || "",
        email:
          cliente.email || "",
        whatsapp:
          cliente.whatsapp || "",
        slug:
          cliente.slug || "",
      };
    })
    .filter(Boolean);
}

export async function GET(
  request: NextRequest
) {
  const admin =
    await getTherapyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Acesso não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const clientes =
      await listarClientes(
        admin.professional,
        admin.central_access
      );

    return NextResponse.json({
      clientes,
    });
  } catch (
    error: unknown
  ) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar pacientes.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  const admin =
    await getTherapyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Acesso não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const body =
      await request.json();

    const nome =
      String(
        body.nome || ""
      ).trim();

    const nomeReferencia =
      String(
        body.nomeReferencia ||
          ""
      ).trim();

    const email =
      String(
        body.email || ""
      )
        .trim()
        .toLowerCase();

    const whatsapp =
      String(
        body.whatsapp || ""
      ).trim();

    if (
      !nome ||
      !email
    ) {
      return NextResponse.json(
        {
          error:
            "Nome e e-mail são obrigatórios.",
        },
        { status: 400 }
      );
    }

    let {
      data: cliente,
      error:
        clienteBuscaError,
    } = await supabaseAdmin
      .from("club_clients")
      .select(
        "id, nome, nome_referencia, email, whatsapp, slug"
      )
      .ilike(
        "email",
        email
      )
      .maybeSingle();

    if (
      clienteBuscaError
    ) {
      throw clienteBuscaError;
    }

    let novoUsuario =
      false;

    let senhaTemporaria:
      string | null = null;

    if (!cliente) {
      senhaTemporaria =
        crypto
          .randomUUID()
          .replace(/-/g, "")
          .slice(0, 10);

      const {
        data: authUser,
        error:
          authError,
      } =
        await supabaseAdmin
          .auth.admin
          .createUser({
            email,
            password:
              senhaTemporaria,
            email_confirm:
              true,
            user_metadata: {
              display_name:
                nome,
            },
          });

      if (authError) {
        return NextResponse.json(
          {
            error:
              authError.message,
          },
          { status: 400 }
        );
      }

      const userId =
        authUser.user?.id;

      if (!userId) {
        throw new Error(
          "Não foi possível criar o acesso da paciente."
        );
      }

      const slugBase =
        criarSlug(nome) ||
        `paciente-${userId.slice(
          0,
          6
        )}`;

      let slug =
        slugBase;

      const {
        data:
          slugExistente,
      } =
        await supabaseAdmin
          .from(
            "club_clients"
          )
          .select("id")
          .eq(
            "slug",
            slug
          )
          .maybeSingle();

      if (slugExistente) {
        slug =
          `${slugBase}-${userId.slice(
            0,
            5
          )}`;
      }

      const {
        data:
          novoCliente,
        error:
          novoClienteError,
      } =
        await supabaseAdmin
          .from(
            "club_clients"
          )
          .insert({
            id: userId,
            nome,
            nome_referencia:
              nomeReferencia ||
              nome.split(" ")[0],
            email,
            whatsapp,
            plano:
              "terapia",
            tipo_assinatura:
              "terapia",
            senha_inicial:
              senhaTemporaria,
            data_inicio:
              new Date()
                .toISOString()
                .slice(
                  0,
                  10
                ),
            slug,
            status:
              "ativo",
            produto:
              "Terapia em Dia",
            acesso_app:
              true,
            direcionamento_exclusivo:
              false,
          })
          .select(
            "id, nome, nome_referencia, email, whatsapp, slug"
          )
          .single();

      if (
        novoClienteError
      ) {
        await supabaseAdmin
          .auth.admin
          .deleteUser(
            userId
          );

        throw novoClienteError;
      }

      cliente =
        novoCliente;

      novoUsuario =
        true;
    }

    const {
      data:
        vinculoAtual,
      error:
        vinculoError,
    } = await supabaseAdmin
      .from(
        "therapy_client_access"
      )
      .select(
        "id, client_id, professional, active"
      )
      .eq(
        "client_id",
        cliente.id
      )
      .maybeSingle();

    if (vinculoError) {
      throw vinculoError;
    }

    if (
      vinculoAtual &&
      vinculoAtual.professional !==
        admin.professional &&
      vinculoAtual.active ===
        true
    ) {
      return NextResponse.json(
        {
          error:
            "Esta paciente já está vinculada a outro profissional no Terapia em Dia.",
        },
        { status: 409 }
      );
    }

    if (vinculoAtual) {
      const {
        error:
          atualizarError,
      } =
        await supabaseAdmin
          .from(
            "therapy_client_access"
          )
          .update({
            professional:
              admin.professional,
            active: true,
          })
          .eq(
            "id",
            vinculoAtual.id
          );

      if (
        atualizarError
      ) {
        throw atualizarError;
      }
    } else {
      const {
        error:
          acessoError,
      } =
        await supabaseAdmin
          .from(
            "therapy_client_access"
          )
          .insert({
            client_id:
              cliente.id,
            professional:
              admin.professional,
            active: true,
            access_token:
              crypto.randomUUID(),
          });

      if (acessoError) {
        throw acessoError;
      }
    }

    let emailEnviado =
      false;

    if (novoUsuario) {
      const {
        error:
          emailError,
      } =
        await supabaseAdmin
          .auth
          .resetPasswordForEmail(
            email,
            {
              redirectTo:
                "https://adriafreitasterapeuta.com.br/auth/reset-password",
            }
          );

      emailEnviado =
        !emailError;
    }

    return NextResponse.json(
      {
        success: true,
        novo_usuario:
          novoUsuario,
        email_enviado:
          emailEnviado,
        cliente: {
          id:
            cliente.id,
          nome:
            cliente
              .nome_referencia ||
            cliente.nome,
          nome_completo:
            cliente.nome,
          email:
            cliente.email,
          slug:
            cliente.slug,
        },
      },
      {
        status:
          novoUsuario
            ? 201
            : 200,
      }
    );
  } catch (
    error: unknown
  ) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao cadastrar paciente.",
      },
      { status: 500 }
    );
  }
}
