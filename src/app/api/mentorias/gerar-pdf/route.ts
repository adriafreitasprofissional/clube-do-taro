import jsPDF from "jspdf";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RelatorioGerado = {
  sintese?: string;
  pontos_desenvolver?: string;
  exercicios_praticos?: string;
  orientacoes_vida_saudavel?: string;
  plano_acompanhamento?: string;
  mensagem_final?: string;
};

type ClienteRelacionado = {
  nome: string | null;
  nome_referencia: string | null;
};

type RegistroMentoria = {
  id: string;
  client_id: string;
  title: string;
  occurred_at: string;
  report_adria: string | null;
  report_estella: string | null;
  generated_report: RelatorioGerado | null;

  club_clients:
    | ClienteRelacionado
    | ClienteRelacionado[]
    | null;
};

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

  const { data: admin } = await supabaseAdmin
    .from("club_clients")
    .select("id")
    .ilike("email", user.email)
    .eq("role", "admin")
    .maybeSingle();

  return Boolean(admin);
}

function limparTexto(valor: unknown) {
  return String(valor || "")
    .replace(
      /[\u{1F300}-\u{1FAFF}]/gu,
      ""
    )
    .replace(
      /[\u{2600}-\u{27BF}]/gu,
      ""
    )
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, "-")
    .trim();
}

function nomeDoArquivo(valor: string) {
  return valor
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-zA-Z0-9]+/g,
      "-"
    )
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function criarPdf({
  nome,
  titulo,
  data,
  parecerAdria,
  parecerEstella,
  relatorio,
}: {
  nome: string;
  titulo: string;
  data: string;
  parecerAdria: string;
  parecerEstella: string;
  relatorio: RelatorioGerado;
}) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const largura = 210;
  const altura = 297;
  const margem = 20;

  const larguraTexto =
    largura - margem * 2;

  const limiteInferior =
    altura - 22;

  let y = 24;

  function cabecalhoInterno() {
    pdf.setFillColor(35, 0, 47);

    pdf.rect(
      0,
      0,
      largura,
      13,
      "F"
    );

    pdf.setTextColor(231, 201, 111);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);

    pdf.text(
      "CLUBE DO TARO - MENTORIA INDIVIDUAL",
      margem,
      8.5
    );

    pdf.setTextColor(42, 22, 50);

    y = 25;
  }

  function novaPagina() {
    pdf.addPage();

    cabecalhoInterno();
  }

  function garantirEspaco(
    necessario: number
  ) {
    if (
      y + necessario >
      limiteInferior
    ) {
      novaPagina();
    }
  }

  function adicionarParagrafos(
    textoOriginal: string
  ) {
    const texto =
      limparTexto(textoOriginal);

    if (!texto) {
      return;
    }

    const paragrafos =
      texto.split(/\n+/);

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(10.5);
    pdf.setTextColor(49, 31, 57);

    paragrafos.forEach(
      (paragrafo) => {
        const linhas =
          pdf.splitTextToSize(
            paragrafo,
            larguraTexto
          ) as string[];

        linhas.forEach((linha) => {
          garantirEspaco(6);

          pdf.text(
            linha,
            margem,
            y
          );

          y += 5.5;
        });

        y += 2.5;
      }
    );
  }

  function adicionarSecao(
    tituloSecao: string,
    conteudo: unknown
  ) {
    const texto =
      limparTexto(conteudo);

    if (!texto) {
      return;
    }

    garantirEspaco(22);

    y += 4;

    pdf.setFillColor(
      247,
      242,
      250
    );

    pdf.roundedRect(
      margem,
      y - 6,
      larguraTexto,
      11,
      2.5,
      2.5,
      "F"
    );

    pdf.setTextColor(
      83,
      40,
      102
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(12);

    pdf.text(
      limparTexto(tituloSecao),
      margem + 4,
      y + 1
    );

    y += 12;

    adicionarParagrafos(texto);
  }

  pdf.setFillColor(31, 6, 43);

  pdf.rect(
    0,
    0,
    largura,
    altura,
    "F"
  );

  pdf.setDrawColor(
    231,
    201,
    111
  );

  pdf.setLineWidth(0.6);

  pdf.roundedRect(
    14,
    14,
    largura - 28,
    altura - 28,
    4,
    4,
    "S"
  );

  pdf.setTextColor(
    231,
    201,
    111
  );

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(11);

  pdf.text(
    "CLUBE DO TARO",
    largura / 2,
    48,
    {
      align: "center",
    }
  );

  pdf.setTextColor(
    255,
    255,
    255
  );

  pdf.setFontSize(25);

  pdf.text(
    "RELATORIO DE MENTORIA",
    largura / 2,
    78,
    {
      align: "center",
    }
  );

  pdf.setTextColor(
    231,
    201,
    111
  );

  pdf.setFontSize(19);

  pdf.text(
    limparTexto(nome),
    largura / 2,
    105,
    {
      align: "center",
    }
  );

  pdf.setTextColor(
    235,
    226,
    241
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(12);

  const linhasTitulo =
    pdf.splitTextToSize(
      limparTexto(titulo),
      150
    ) as string[];

  pdf.text(
    linhasTitulo,
    largura / 2,
    128,
    {
      align: "center",
    }
  );

  pdf.text(
    limparTexto(data),
    largura / 2,
    151,
    {
      align: "center",
    }
  );

  pdf.setFontSize(9);

  pdf.setTextColor(
    201,
    187,
    211
  );

  pdf.text(
    "Conteudo pessoal e confidencial",
    largura / 2,
    260,
    {
      align: "center",
    }
  );

  pdf.text(
    "Adria Freitas",
    largura / 2,
    268,
    {
      align: "center",
    }
  );

  novaPagina();

  adicionarSecao(
    "Parecer da Adria",
    parecerAdria
  );

  adicionarSecao(
    "Mensagem espiritual de Estella",
    parecerEstella
  );

  adicionarSecao(
    "Sintese do momento atual",
    relatorio.sintese
  );

  adicionarSecao(
    "Pontos para desenvolver",
    relatorio.pontos_desenvolver
  );

  adicionarSecao(
    "Exercicios personalizados",
    relatorio.exercicios_praticos
  );

  adicionarSecao(
    "Orientacoes para uma vida saudavel",
    relatorio.orientacoes_vida_saudavel
  );

  adicionarSecao(
    "Plano para os proximos sete dias",
    relatorio.plano_acompanhamento
  );

  adicionarSecao(
    "Mensagem final",
    relatorio.mensagem_final
  );

  const totalPaginas =
    pdf.getNumberOfPages();

  for (
    let pagina = 2;
    pagina <= totalPaginas;
    pagina++
  ) {
    pdf.setPage(pagina);

    pdf.setDrawColor(
      231,
      201,
      111
    );

    pdf.setLineWidth(0.2);

    pdf.line(
      margem,
      altura - 13,
      largura - margem,
      altura - 13
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(7.5);

    pdf.setTextColor(
      108,
      88,
      116
    );

    pdf.text(
      nome,
      margem,
      altura - 8
    );

    pdf.text(
      `${pagina - 1} / ${totalPaginas - 1}`,
      largura - margem,
      altura - 8,
      {
        align: "right",
      }
    );
  }

  return Buffer.from(
    pdf.output("arraybuffer")
  );
}

export async function POST(
  request: NextRequest
) {
  if (!(await autorizarAdmin(request))) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const id =
      String(body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Mentoria não informada.",
        },
        { status: 400 }
      );
    }

    const { data, error } =
      await supabaseAdmin
        .from(
          "client_service_records"
        )
        .select(`
          id,
          client_id,
          title,
          occurred_at,
          report_adria,
          report_estella,
          generated_report,
          club_clients(
            nome,
            nome_referencia
          )
        `)
        .eq("id", id)
        .single();

    if (error || !data) {
      return NextResponse.json(
        {
          error:
            error?.message ||
            "Mentoria não encontrada.",
        },
        { status: 404 }
      );
    }

    const registro =
      data as unknown as RegistroMentoria;

    const clienteRelacionado =
      Array.isArray(
        registro.club_clients
      )
        ? registro.club_clients[0]
        : registro.club_clients;

    const nome =
      clienteRelacionado
        ?.nome_referencia ||
      clienteRelacionado?.nome ||
      "Assinante";

    const relatorio =
      registro.generated_report || {};

    const possuiRelatorio =
      Object.values(relatorio).some(
        (valor) =>
          limparTexto(valor)
      );

    if (!possuiRelatorio) {
      return NextResponse.json(
        {
          error:
            "Gere e salve o relatório antes de criar o PDF.",
        },
        { status: 400 }
      );
    }

    const dataMentoria =
      new Date(
        registro.occurred_at
      );

    const dataFormatada =
      dataMentoria.toLocaleDateString(
        "pt-BR",
        {
          dateStyle: "long",
          timeZone:
            "America/Sao_Paulo",
        }
      );

    const dataArquivo =
      dataMentoria
        .toLocaleDateString(
          "pt-BR",
          {
            timeZone:
              "America/Sao_Paulo",
          }
        )
        .replace(/\//g, "-");

    const arquivo =
      `Relatorio-de-Mentoria-` +
      `${nomeDoArquivo(nome)}-` +
      `${dataArquivo}.pdf`;

    const caminho =
      `${registro.client_id}/` +
      `${registro.id}/` +
      `${arquivo}`;

    const pdf = criarPdf({
      nome,
      titulo: registro.title,
      data: dataFormatada,

      parecerAdria:
        registro.report_adria || "",

      parecerEstella:
        registro.report_estella || "",

      relatorio,
    });

    const {
      error: uploadError,
    } = await supabaseAdmin.storage
      .from("mentoria-pdfs")
      .upload(caminho, pdf, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          error:
            uploadError.message,
        },
        { status: 500 }
      );
    }

    const geradoEm =
      new Date().toISOString();

    const {
      error: updateError,
    } = await supabaseAdmin
      .from(
        "client_service_records"
      )
      .update({
        pdf_storage_path: caminho,
        pdf_file_name: arquivo,
        pdf_generated_at: geradoEm,
      })
      .eq("id", registro.id);

    if (updateError) {
      await supabaseAdmin.storage
        .from("mentoria-pdfs")
        .remove([caminho]);

      return NextResponse.json(
        {
          error:
            updateError.message,
        },
        { status: 500 }
      );
    }

        const {
      data: urlData,
      error: urlError,
    } = await supabaseAdmin.storage
      .from("mentoria-pdfs")
      .createSignedUrl(
        caminho,
        60 * 60
      );

    if (urlError || !urlData?.signedUrl) {
      return NextResponse.json(
        {
          error:
            urlError?.message ||
            "PDF criado, mas não foi possível abrir a visualização.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,

      pdf_storage_path:
        caminho,

      pdf_file_name:
        arquivo,

      pdf_url:
        urlData.signedUrl,

      pdf_generated_at:
        geradoEm,
    });




  } catch (error: unknown) {
    console.error(
      "Erro ao gerar PDF da mentoria:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível gerar o PDF.",
      },
      { status: 500 }
    );
  }
}