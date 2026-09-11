import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

function bearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization") || "";

  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

export async function GET(
  request: NextRequest
) {
  try {
    const slug =
      request.nextUrl.searchParams
        .get("slug")
        ?.trim() || "";

    if (!slug) {
      return NextResponse.json(
        {
          error: "Slug não informado.",
        },
        {
          status: 400,
        }
      );
    }

    const token = bearerToken(request);

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Sessão não encontrada. Entre novamente no Clube.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user?.email) {
      return NextResponse.json(
        {
          error:
            "Sessão inválida. Entre novamente no Clube.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: cliente,
      error: clienteError,
    } = await supabaseAdmin
      .from("club_clients")
      .select(
        "id, nome, nome_referencia, genero, email, slug, role"
      )
      .eq("slug", slug)
      .maybeSingle();

    if (clienteError || !cliente) {
      return NextResponse.json(
        {
          error: "Assinante não encontrada.",
        },
        {
          status: 404,
        }
      );
    }

    const emailUsuario =
      user.email.toLowerCase();

    const mesmoEmail =
      String(cliente.email || "").toLowerCase() ===
      emailUsuario;

    let ehAdmin = false;

    if (!mesmoEmail) {
      const { data: admin } =
        await supabaseAdmin
          .from("club_clients")
          .select("id")
          .ilike("email", emailUsuario)
          .eq("role", "admin")
          .maybeSingle();

      ehAdmin = Boolean(admin);
    }

    if (!mesmoEmail && !ehAdmin) {
      return NextResponse.json(
        {
          error:
            "Você não pode acessar esta Jornada.",
        },
        {
          status: 403,
        }
      );
    }

    const {
      data: eventos,
      error: estrelasError,
    } = await supabaseAdmin
      .from("guardian_star_events")
      .select(
        "id, title, description, stars, event_type, created_at"
      )
      .eq("client_id", cliente.id)
      .eq("visible_to_client", true)
      .order("created_at", {
        ascending: false,
      });

    if (estrelasError) {
      console.error(
        "Erro ao carregar estrelas:",
        estrelasError
      );

      return NextResponse.json(
        {
          error:
            "Não foi possível carregar suas estrelas.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        cliente: {
          id: cliente.id,
          nome: cliente.nome,
          nome_referencia:
            cliente.nome_referencia,
          genero: cliente.genero,
          slug: cliente.slug,
        },
        eventos: eventos || [],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Erro na Jornada:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erro interno ao carregar a Jornada.",
      },
      {
        status: 500,
      }
    );
  }
}
