import {
  NextRequest,
  NextResponse,
} from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function bearerToken(
  request: NextRequest
) {
  const authorization =
    request.headers.get(
      "authorization"
    ) || "";

  return authorization.startsWith(
    "Bearer "
  )
    ? authorization
        .slice("Bearer ".length)
        .trim()
    : "";
}

async function verificarAdmin(
  request: NextRequest
) {
  const token =
    bearerToken(request);

  if (!token) {
    return false;
  }

  const {
    data: { user },
    error: userError,
  } =
    await supabaseAdmin.auth.getUser(
      token
    );

  if (
    userError ||
    !user?.email
  ) {
    return false;
  }

  const {
    data: admin,
    error: adminError,
  } = await supabaseAdmin
    .from("club_clients")
    .select("id")
    .ilike(
      "email",
      user.email
    )
    .eq("role", "admin")
    .eq("status", "ativo")
    .maybeSingle();

  return Boolean(
    admin && !adminError
  );
}

export async function GET(
  request: NextRequest
) {
  try {
    if (
      !(await verificarAdmin(
        request
      ))
    ) {
      return NextResponse.json(
        {
          error:
            "Acesso administrativo não autorizado.",
        },
        { status: 401 }
      );
    }

    const [
      clientesResult,
      escutasResult,
      conteudosResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("club_clients")
        .select(
          "id,nome,nome_referencia,plano,status,tipo_assinatura,slug,data_inicio"
        )
        .eq(
          "produto",
          "Clube do Tarô"
        )
        .eq(
          "status",
          "ativo"
        )
        .order(
          "nome",
          {
            ascending: true,
          }
        ),

      supabaseAdmin
        .from(
          "direction_listens"
        )
        .select(
          "id,cliente_id,slug,ano,mes,semana,tipo,first_listened_at,last_listened_at,listen_count"
        )
        .eq(
          "tipo",
          "audio"
        )
        .order(
          "last_listened_at",
          {
            ascending: false,
          }
        ),

      supabaseAdmin
        .from(
          "club_directional_assets"
        )
        .select(
          "id,client_id,slug,ano,mes,semana,tipo,ativo,released_at"
        )
        .eq(
          "tipo",
          "audio_individual"
        )
        .eq(
          "ativo",
          true
        ),
    ]);

    if (
      clientesResult.error
    ) {
      throw clientesResult.error;
    }

    if (
      escutasResult.error
    ) {
      throw escutasResult.error;
    }

    if (
      conteudosResult.error
    ) {
      throw conteudosResult.error;
    }

    return NextResponse.json(
      {
        clientes:
          clientesResult.data ||
          [],
        escutas:
          escutasResult.data ||
          [],
        conteudos:
          conteudosResult.data ||
          [],
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Erro ao carregar assiduidade:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar assiduidade.",
      },
      { status: 500 }
    );
  }
}
