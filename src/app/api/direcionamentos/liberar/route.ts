import {
  NextRequest,
  NextResponse,
} from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const MESES = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

function numeroSemanaDoMes(
  data: Date
) {
  const primeiroDia = new Date(
    data.getFullYear(),
    data.getMonth(),
    1
  );

  const diaSemanaPrimeiro =
    (primeiroDia.getDay() + 6) % 7;

  return Math.ceil(
    (data.getDate() + diaSemanaPrimeiro) / 7
  );
}

function obterPeriodo(
  dataInicio: string,
  dataFim?: string
) {
  const dataInicial = new Date(`${dataInicio}T12:00:00`);
  const dataFinal = dataFim
    ? new Date(`${dataFim}T12:00:00`)
    : new Date(dataInicial);

  if (!dataFim) {
    dataFinal.setDate(dataFinal.getDate() + 6);
  }

  const diferencaDias = Math.round(
    (dataFinal.getTime() - dataInicial.getTime()) / 86400000
  );

  const data = new Date(dataInicial);
  data.setDate(
    data.getDate() + Math.floor(diferencaDias / 2)
  );

  if (Number.isNaN(data.getTime())) {
    throw new Error(
      "Data inicial inválida."
    );
  }

  return {
    ano: String(data.getFullYear()),
    mes: MESES[data.getMonth()],
    semana: String(
      numeroSemanaDoMes(data)
    ),
  };
}

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
    return null;
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
    return null;
  }

  const {
    data: admin,
    error: adminError,
  } = await supabaseAdmin
    .from("club_clients")
    .select("id,email,role")
    .ilike("email", user.email)
    .maybeSingle();

  if (
    adminError ||
    !admin ||
    admin.role !== "admin"
  ) {
    return null;
  }

  return admin;
}

async function buscarCliente(
  slug: string
) {
  const {
    data: cliente,
    error,
  } = await supabaseAdmin
    .from("club_clients")
    .select("id,slug,nome")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return cliente;
}

async function buscarAssets({
  clientId,
  ano,
  mes,
  semana,
}: {
  clientId: string;
  ano: string;
  mes: string;
  semana: string;
}) {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from(
      "club_directional_assets"
    )
    .select(
      `
      id,
      tipo,
      drive_file_id,
      ativo,
      released_at
    `
    )
    .eq(
      "client_id",
      clientId
    )
    .eq("ano", ano)
    .eq("mes", mes)
    .eq("semana", semana)
    .in("tipo", [
      "pdf_individual",
      "audio_individual",
    ]);

  if (error) {
    throw error;
  }

  return data || [];
}

function montarStatus(
  assets: Array<{
    id: string;
    tipo: string;
    drive_file_id: string | null;
    ativo: boolean | null;
    released_at: string | null;
  }>
) {
  const pdf = assets.find(
    (item) =>
      item.tipo ===
      "pdf_individual"
  );

  const audio = assets.find(
    (item) =>
      item.tipo ===
      "audio_individual"
  );

  const pdfPronto =
    Boolean(pdf?.drive_file_id);

  const audioPronto =
    Boolean(audio?.drive_file_id);

  const liberado =
    pdfPronto &&
    audioPronto &&
    Boolean(pdf?.ativo) &&
    Boolean(audio?.ativo);

  const releasedAt =
    pdf?.released_at ||
    audio?.released_at ||
    null;

  return {
    pdfPronto,
    audioPronto,
    liberado,
    releasedAt,
  };
}

export async function GET(
  request: NextRequest
) {
  try {
    const admin =
      await verificarAdmin(request);

    if (!admin) {
      return NextResponse.json(
        {
          error:
            "Acesso administrativo não autorizado.",
        },
        { status: 401 }
      );
    }

    const slug = String(
      request.nextUrl.searchParams.get(
        "slug"
      ) || ""
    )
      .toLowerCase()
      .trim();

    const dataInicio = String(
      request.nextUrl.searchParams.get(
        "dataInicio"
      ) || ""
    ).trim();

    if (!slug || !dataInicio) {
      return NextResponse.json(
        {
          error:
            "Assinante e semana são obrigatórias.",
        },
        { status: 400 }
      );
    }

    const cliente =
      await buscarCliente(slug);

    if (!cliente?.id) {
      return NextResponse.json(
        {
          error:
            "Assinante não encontrada.",
        },
        { status: 404 }
      );
    }

    const dataFim = String(
      request.nextUrl.searchParams.get("dataFim") || ""
    ).trim();

    const periodo =
      obterPeriodo(dataInicio, dataFim);

    const assets =
      await buscarAssets({
        clientId: cliente.id,
        ...periodo,
      });

    return NextResponse.json(
      {
        success: true,
        ...montarStatus(
          assets as Array<{
            id: string;
            tipo: string;
            drive_file_id:
              | string
              | null;
            ativo:
              | boolean
              | null;
            released_at:
              | string
              | null;
          }>
        ),
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
      "Erro ao verificar direcionamento:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao verificar direcionamento.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const admin =
      await verificarAdmin(request);

    if (!admin) {
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

    const slug = String(
      body?.slug || ""
    )
      .toLowerCase()
      .trim();

    const dataInicio = String(
      body?.dataInicio || ""
    ).trim();

    if (!slug || !dataInicio) {
      return NextResponse.json(
        {
          error:
            "Assinante e semana são obrigatórias.",
        },
        { status: 400 }
      );
    }

    const cliente =
      await buscarCliente(slug);

    if (!cliente?.id) {
      return NextResponse.json(
        {
          error:
            "Assinante não encontrada.",
        },
        { status: 404 }
      );
    }

    const dataFim = String(
      body?.dataFim || ""
    ).trim();

    const periodo =
      obterPeriodo(dataInicio, dataFim);

    const assets =
      await buscarAssets({
        clientId: cliente.id,
        ...periodo,
      });

    const status =
      montarStatus(
        assets as Array<{
          id: string;
          tipo: string;
          drive_file_id:
            | string
            | null;
          ativo:
            | boolean
            | null;
          released_at:
            | string
            | null;
        }>
      );

    if (
      !status.pdfPronto ||
      !status.audioPronto
    ) {
      return NextResponse.json(
        {
          error:
            "O PDF e o áudio precisam estar salvos antes da liberação.",
        },
        { status: 400 }
      );
    }

    const agora =
      new Date().toISOString();

    const {
      data: liberados,
      error: liberarError,
    } = await supabaseAdmin
      .from(
        "club_directional_assets"
      )
      .update({
        ativo: true,
        released_at: agora,
        updated_at: agora,
      })
      .eq(
        "client_id",
        cliente.id
      )
      .eq(
        "ano",
        periodo.ano
      )
      .eq(
        "mes",
        periodo.mes
      )
      .eq(
        "semana",
        periodo.semana
      )
      .in("tipo", [
        "pdf_individual",
        "audio_individual",
      ])
      .select(
        "id,tipo,ativo,released_at"
      );

    if (liberarError) {
      throw liberarError;
    }

    if (
      !liberados ||
      liberados.length < 2
    ) {
      throw new Error(
        "A liberação não encontrou os dois arquivos da semana."
      );
    }

    return NextResponse.json({
      success: true,
      liberado: true,
      releasedAt: agora,
      quantidade:
        liberados.length,
    });
  } catch (error) {
    console.error(
      "Erro ao liberar direcionamento:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao liberar direcionamento.",
      },
      { status: 500 }
    );
  }
}
