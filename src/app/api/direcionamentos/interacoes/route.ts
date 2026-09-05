import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

type OpcaoDirecionamento =
  | "muito_bom"
  | "duvida"
  | "elogio"
  | "sugestao";

function bearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization") || "";

  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

function capitalizar(texto: string) {
  if (!texto) {
    return "";
  }

  return (
    texto.charAt(0).toUpperCase() +
    texto.slice(1)
  );
}

function rotuloOpcao(
  opcao: OpcaoDirecionamento
) {
  if (opcao === "muito_bom") {
    return "Muito bom";
  }

  if (opcao === "duvida") {
    return "Ainda tenho dúvidas";
  }

  if (opcao === "elogio") {
    return "Elogios";
  }

  return "Sugestões";
}

function tipoDaInteracao(
  opcao: OpcaoDirecionamento
) {
  if (opcao === "duvida") {
    return "duvida";
  }

  if (opcao === "sugestao") {
    return "sugestao";
  }

  return "feedback";
}

function montarMensagem(
  ano: string,
  mes: string,
  semana: string,
  opcao: OpcaoDirecionamento,
  mensagem: string
) {
  return [
    `📍 Direcionamento — ${semana}ª Semana de ${capitalizar(
      mes
    )} de ${ano}`,
    `🏷️ ${rotuloOpcao(opcao)}`,
    "",
    mensagem.trim(),
  ].join("\n");
}

function extrairMensagem(
  mensagemCompleta: string
) {
  const linhas =
    String(mensagemCompleta || "").split("\n");

  const primeira =
    linhas[0]?.match(
      /^📍 Direcionamento — (.+?)ª Semana de (.+?) de (\d{4})$/
    );

  if (!primeira) {
    return null;
  }

  const rotulo =
    String(linhas[1] || "")
      .replace(/^🏷️\s*/, "")
      .trim();

  let opcao: OpcaoDirecionamento =
    "muito_bom";

  if (rotulo === "Ainda tenho dúvidas") {
    opcao = "duvida";
  } else if (rotulo === "Elogios") {
    opcao = "elogio";
  } else if (rotulo === "Sugestões") {
    opcao = "sugestao";
  }

  return {
    semana: primeira[1],
    mes:
      primeira[2]
        .charAt(0)
        .toLowerCase() +
      primeira[2].slice(1),
    ano: primeira[3],
    opcao,
    message: linhas.slice(3).join("\n").trim(),
  };
}

async function obterClienteAutorizado(
  request: NextRequest,
  slug: string
) {
  const token = bearerToken(request);

  if (!token) {
    return {
      cliente: null,
      error: "Sessão não encontrada.",
      status: 401,
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user?.email) {
    return {
      cliente: null,
      error:
        "Sessão inválida. Entre novamente no portal.",
      status: 401,
    };
  }

  const {
    data: cliente,
    error: clienteError,
  } = await supabaseAdmin
    .from("club_clients")
    .select(
      "id, email, slug, status"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (clienteError || !cliente) {
    return {
      cliente: null,
      error: "Assinante não encontrada.",
      status: 404,
    };
  }

  const mesmoEmail =
    String(cliente.email || "").toLowerCase() ===
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
    return {
      cliente: null,
      error:
        "Você não pode enviar mensagens por este portal.",
      status: 403,
    };
  }

  return {
    cliente,
    error: null,
    status: 200,
  };
}

export async function GET(
  request: NextRequest
) {
  const slug =
    request.nextUrl.searchParams
      .get("slug")
      ?.trim();

  if (!slug) {
    return NextResponse.json(
      {
        error:
          "Assinante não informada.",
      },
      { status: 400 }
    );
  }

  const autorizado =
    await obterClienteAutorizado(
      request,
      slug
    );

  if (!autorizado.cliente) {
    return NextResponse.json(
      {
        error: autorizado.error,
      },
      {
        status: autorizado.status,
      }
    );
  }

  const cliente =
    autorizado.cliente;

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("client_interactions")
    .select(`
      id,
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
      "direcionamento"
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  const interacoes =
    (data || [])
      .map((item) => {
        const origem =
          extrairMensagem(
            item.message
          );

        if (!origem) {
          return null;
        }

        return {
          id: item.id,
          ano: origem.ano,
          mes: origem.mes,
          semana: origem.semana,
          opcao: origem.opcao,
          interaction_type:
            item.interaction_type,
          message:
            origem.message,
          admin_reply:
            item.admin_reply,
          replied_at:
            item.replied_at,
          status:
            item.status,
          created_at:
            item.created_at,
        };
      })
      .filter(Boolean);

  return NextResponse.json({
    interacoes,
  });
}

export async function POST(
  request: NextRequest
) {
  const body =
    await request.json();

  const slug =
    String(
      body.slug || ""
    ).trim();

  const ano =
    String(
      body.ano || ""
    ).trim();

  const mes =
    String(
      body.mes || ""
    )
      .trim()
      .toLowerCase();

  const semana =
    String(
      body.semana || ""
    ).trim();

  const opcao =
    String(
      body.opcao ||
      body.escolha ||
      body.tipo ||
      body.interaction_type ||
      ""
    ).trim() as OpcaoDirecionamento;

  const message =
    String(
      body.message ||
      body.mensagem ||
      body.texto ||
      ""
    ).trim();

  const opcoesValidas:
    OpcaoDirecionamento[] = [
      "muito_bom",
      "duvida",
      "elogio",
      "sugestao",
    ];

  if (!slug) {
    return NextResponse.json(
      {
        error:
          "Não foi possível identificar a assinante.",
      },
      { status: 400 }
    );
  }

  if (!ano || !mes || !semana) {
    return NextResponse.json(
      {
        error:
          "Não foi possível identificar este direcionamento semanal.",
      },
      { status: 400 }
    );
  }

  if (!opcoesValidas.includes(opcao)) {
    return NextResponse.json(
      {
        error:
          "Escolha uma opção antes de enviar.",
      },
      { status: 400 }
    );
  }

  if (!message) {
    return NextResponse.json(
      {
        error:
          "Escreva sua mensagem antes de enviar.",
      },
      { status: 400 }
    );
  }

  const autorizado =
    await obterClienteAutorizado(
      request,
      slug
    );

  if (!autorizado.cliente) {
    return NextResponse.json(
      {
        error: autorizado.error,
      },
      {
        status: autorizado.status,
      }
    );
  }

  const cliente =
    autorizado.cliente;

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("client_interactions")
    .insert({
      client_id:
        cliente.id,
      source_type:
        "direcionamento",
      source_id:
        null,
      interaction_type:
        tipoDaInteracao(opcao),
      message:
        montarMensagem(
          ano,
          mes,
          semana,
          opcao,
          message
        ),
      status:
        "novo",
    })
    .select(
      "id, created_at"
    )
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
      success: true,
      id: data.id,
      created_at:
        data.created_at,
    },
    { status: 201 }
  );
}
