import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

const CAMPOS = `
  id,
  client_id,
  service_type,
  title,
  occurred_at,
  video_provider,
  video_file_id,
  report_adria,
  report_estella,
  generated_report,
  generated_report_at,
  pdf_file_id,
  pdf_storage_path,
  pdf_file_name,
  pdf_generated_at,
  published,
  created_at,
  updated_at
`;

function bearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization") || "";

  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

async function autorizarAdmin(
  request: NextRequest
) {
  const token = bearerToken(request);

  if (!token) {
    return false;
  }

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);

  if (!user?.email) {
    return false;
  }

  const { data: admin } =
    await supabaseAdmin
      .from("club_clients")
      .select("id")
      .ilike("email", user.email)
      .eq("role", "admin")
      .maybeSingle();

  return Boolean(admin);
}

function limparIdDrive(valor: unknown) {
  const texto =
    String(valor || "").trim();

  if (!texto) {
    return null;
  }

  const encontrado =
    texto.match(
      /\/d\/([^/?]+)/
    )?.[1];

  return encontrado || texto;
}

function montarRegistro(
  body: Record<string, unknown>
) {
  return {
    client_id:
      String(
        body.client_id || ""
      ).trim(),

    service_type:
      String(
        body.service_type ||
          "mentoria"
      ).trim(),

    title:
      String(
        body.title || ""
      ).trim(),

    occurred_at:
      String(
        body.occurred_at || ""
      ).trim(),

    video_provider:
      "google_drive",

    video_file_id:
      limparIdDrive(
        body.video_file_id
      ),

    report_adria:
      String(
        body.report_adria || ""
      ).trim() || null,

    report_estella:
      String(
        body.report_estella || ""
      ).trim() || null,

    pdf_file_id:
      limparIdDrive(
        body.pdf_file_id
      ),

    published:
      Boolean(body.published),
  };
}

function incluirRelatorioGerado(
  body: Record<string, unknown>
) {
  return {
    ...montarRegistro(body),

    ...(body.generated_report !==
    undefined
      ? {
          generated_report:
            body.generated_report,

          generated_report_at:
            body.generated_report_at ||
            new Date().toISOString(),
        }
      : {}),
  };
}

export async function GET(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(request))
  ) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  const { data, error } =
    await supabaseAdmin
      .from(
        "client_service_records"
      )
      .select(
        `${CAMPOS}, club_clients(nome, nome_referencia, slug, plano)`
      )
      .order(
        "occurred_at",
        {
          ascending: false,
        }
      );

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }

  const registros =
    await Promise.all(
      (data || []).map(
        async (registro) => {
          if (
            !registro.pdf_storage_path
          ) {
            return {
              ...registro,
              pdf_url: null,
            };
          }

          const {
            data: urlData,
          } =
            await supabaseAdmin.storage
              .from("mentoria-pdfs")
              .createSignedUrl(
                registro.pdf_storage_path,
                60 * 60
              );

          return {
            ...registro,

            pdf_url:
              urlData?.signedUrl ||
              null,
          };
        }
      )
    );

  return NextResponse.json({
    registros,
  });
}

export async function POST(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(request))
  ) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  const body =
    await request.json();

  const registro =
    incluirRelatorioGerado(body);

  if (
    !registro.client_id ||
    !registro.title ||
    !registro.occurred_at
  ) {
    return NextResponse.json(
      {
        error:
          "Cliente, título e data são obrigatórios.",
      },
      { status: 400 }
    );
  }

  if (
    !registro.video_file_id &&
    !registro.pdf_file_id
  ) {
    return NextResponse.json(
      {
        error:
          "Informe o vídeo da mentoria.",
      },
      { status: 400 }
    );
  }

  const { data, error } =
    await supabaseAdmin
      .from(
        "client_service_records"
      )
      .insert(registro)
      .select(CAMPOS)
      .single();

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      registro: data,
    },
    { status: 201 }
  );
}

export async function PATCH(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(request))
  ) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  const body =
    await request.json();

  const id =
    String(
      body.id || ""
    ).trim();

  if (!id) {
    return NextResponse.json(
      {
        error:
          "Registro não informado.",
      },
      { status: 400 }
    );
  }

  const alteracoes =
    incluirRelatorioGerado(body);

  const { data, error } =
    await supabaseAdmin
      .from(
        "client_service_records"
      )
      .update(alteracoes)
      .eq("id", id)
      .select(CAMPOS)
      .single();

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    registro: data,
  });
}

export async function DELETE(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(request))
  ) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  const id =
    request.nextUrl.searchParams.get(
      "id"
    );

  if (!id) {
    return NextResponse.json(
      {
        error:
          "Registro não informado.",
      },
      { status: 400 }
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        "client_service_records"
      )
      .delete()
      .eq("id", id);

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}