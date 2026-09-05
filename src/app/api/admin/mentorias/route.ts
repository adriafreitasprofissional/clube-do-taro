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
  const slug =
    request.nextUrl.searchParams
      .get("slug")
      ?.trim();

  const token = bearerToken(request);

  if (!slug || !token) {
    return NextResponse.json(
      {
        error: "Acesso não autorizado.",
      },
      { status: 401 }
    );
  }

  const {
    data: { user },
    error: usuarioError,
  } = await supabaseAdmin.auth.getUser(token);

  if (
    usuarioError ||
    !user?.email
  ) {
    return NextResponse.json(
      {
        error:
          "Sessão inválida. Entre novamente no portal.",
      },
      { status: 401 }
    );
  }

  const {
    data: cliente,
    error: clienteError,
  } = await supabaseAdmin
    .from("club_clients")
    .select(
      `
        id,
        nome,
        nome_referencia,
        email,
        slug,
        plano,
        status,
        role
      `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (
    clienteError ||
    !cliente
  ) {
    return NextResponse.json(
      {
        error:
          "Assinante não encontrada.",
      },
      { status: 404 }
    );
  }

  const mesmoEmail =
    String(
      cliente.email || ""
    ).toLowerCase() ===
    user.email.toLowerCase();

  let usuarioEhAdmin = false;

  if (!mesmoEmail) {
    const { data: admin } =
      await supabaseAdmin
        .from("club_clients")
        .select("id")
        .ilike(
          "email",
          user.email
        )
        .eq("role", "admin")
        .maybeSingle();

    usuarioEhAdmin =
      Boolean(admin);
  }

  if (
    !mesmoEmail &&
    !usuarioEhAdmin
  ) {
    return NextResponse.json(
      {
        error:
          "Você não pode acessar as mentorias desta assinante.",
      },
      { status: 403 }
    );
  }

  if (
    String(
      cliente.status || ""
    ).toLowerCase() !== "ativo"
  ) {
    return NextResponse.json(
      {
        error:
          "Este acesso não está ativo.",
      },
      { status: 403 }
    );
  }

  const {
    data: registros,
    error: registrosError,
  } = await supabaseAdmin
    .from(
      "client_service_records"
    )
    .select(`
      id,
      service_type,
      title,
      occurred_at,
      video_provider,
      video_file_id,
      report_adria,
      report_estella,
      pdf_file_id,
      pdf_storage_path,
      pdf_file_name,
      pdf_generated_at
    `)
    .eq(
      "client_id",
      cliente.id
    )
    .eq(
      "service_type",
      "mentoria"
    )
    .eq(
      "published",
      true
    )
    .order(
      "occurred_at",
      {
        ascending: false,
      }
    );

  if (registrosError) {
    return NextResponse.json(
      {
        error:
          registrosError.message,
      },
      { status: 500 }
    );
  }

  const idsMentorias =
    (registros || []).map(
      (registro) =>
        registro.id
    );

  let interacoes: {
    id: string;
    source_id: string | null;
    interaction_type: string;
    message: string;
    admin_reply: string | null;
    replied_at: string | null;
    status: string;
    created_at: string;
  }[] = [];

  if (
    idsMentorias.length > 0
  ) {
    const {
      data: interacoesData,
      error: interacoesError,
    } = await supabaseAdmin
      .from(
        "client_interactions"
      )
      .select(`
        id,
        source_id,
        interaction_type,
        message,
        admin_reply,
        replied_at,
        status,
        created_at
      `)
      .eq(
        "client_id",
        cliente.id
      )
      .eq(
        "source_type",
        "mentoria"
      )
      .in(
        "source_id",
        idsMentorias
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (interacoesError) {
      console.error(
        "Erro ao carregar interações:",
        interacoesError
      );
    }

    interacoes =
      interacoesData || [];
  }

  const registrosComPdf =
    await Promise.all(
      (registros || []).map(
        async (registro) => {
          let pdf_download_url:
            | string
            | null = null;

          if (
            registro.pdf_storage_path
          ) {
            const {
              data: urlData,
              error: urlError,
            } =
              await supabaseAdmin
                .storage
                .from(
                  "mentoria-pdfs"
                )
                .createSignedUrl(
                  registro.pdf_storage_path,
                  60 * 60
                );

            if (urlError) {
              console.error(
                "Erro ao gerar URL do PDF:",
                urlError
              );
            }

            pdf_download_url =
              urlData?.signedUrl ||
              null;
          }

          return {
            ...registro,

            pdf_download_url,

            interacoes:
              interacoes.filter(
                (item) =>
                  item.source_id ===
                  registro.id
              ),
          };
        }
      )
    );

  return NextResponse.json({
    cliente: {
      nome:
        cliente.nome_referencia ||
        cliente.nome,

      plano:
        cliente.plano,
    },

    registros:
      registrosComPdf,
  });
}