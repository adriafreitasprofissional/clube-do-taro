import { NextResponse } from "next/server";
import {
  garantirPastaAssinante,
  getGoogleDriveAuth,
  getDriveClient,
} from "@/lib/google-drive";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearerToken(req: Request) {
  const auth = req.headers.get("authorization") || "";
  return auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : "";
}

function numeroSemanaDoMes(data: Date) {
  const primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1);
  const diaSemanaPrimeiro = (primeiroDia.getDay() + 6) % 7;
  return Math.ceil((data.getDate() + diaSemanaPrimeiro) / 7);
}

function escaparQuery(valor: string) {
  return valor.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export async function POST(req: Request) {
  try {
    const token = bearerToken(req);

    if (!token) {
      return NextResponse.json(
        { error: "Nao autorizado." },
        { status: 401 }
      );
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.getUser(token);

    if (authError || !authData.user?.email) {
      return NextResponse.json(
        { error: "Nao autorizado." },
        { status: 401 }
      );
    }

    const { data: operador, error: operadorError } = await supabaseAdmin
      .from("club_clients")
      .select("id,email,role,status")
      .eq("email", authData.user.email)
      .maybeSingle();

    if (
      operadorError ||
      !operador ||
      !["admin", "profissional"].includes(operador.role)
    ) {
      return NextResponse.json(
        { error: "Acesso negado." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const slug = String(body?.slug || "").trim();
    const dataInicio = String(body?.dataInicio || "").trim();
    const dataFim = String(body?.dataFim || "").trim();
    const tamanho = Number(body?.tamanho || 0);

    if (!slug) {
      return NextResponse.json(
        { error: "Consulente sem slug." },
        { status: 400 }
      );
    }

    if (!dataInicio) {
      return NextResponse.json(
        { error: "Data inicial da semana nao informada." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(tamanho) || tamanho <= 0) {
      return NextResponse.json(
        { error: "Tamanho do arquivo invalido." },
        { status: 400 }
      );
    }

    const { data: cliente, error: clienteError } = await supabaseAdmin
      .from("club_clients")
      .select("id,slug,professional_id")
      .ilike("slug", slug)
      .maybeSingle();

    if (clienteError) throw clienteError;

    if (!cliente?.id) {
      return NextResponse.json(
        { error: "Consulente nao encontrado." },
        { status: 404 }
      );
    }

    if (
      operador.role === "profissional" &&
      cliente.professional_id !== operador.id
    ) {
      return NextResponse.json(
        { error: "Acesso negado a este consulente." },
        { status: 403 }
      );
    }

    const dataInicial = new Date(`${dataInicio}T12:00:00`);

    if (Number.isNaN(dataInicial.getTime())) {
      return NextResponse.json(
        { error: "Data inicial invalida." },
        { status: 400 }
      );
    }

    const dataFinal = dataFim
      ? new Date(`${dataFim}T12:00:00`)
      : new Date(dataInicial);

    if (!dataFim) {
      dataFinal.setDate(dataFinal.getDate() + 6);
    }

    if (Number.isNaN(dataFinal.getTime())) {
      return NextResponse.json(
        { error: "Data final invalida." },
        { status: 400 }
      );
    }

    const diferencaDias = Math.round(
      (dataFinal.getTime() - dataInicial.getTime()) / 86400000
    );

    const data = new Date(dataInicial);
    data.setDate(data.getDate() + Math.floor(diferencaDias / 2));

    const semana = numeroSemanaDoMes(data);
    const pasta = await garantirPastaAssinante({ slug, data });

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");

    const slugSeguro = slug
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const nomeArquivo =
      "semana-" +
      semana +
      "-" +
      slugSeguro +
      "-" +
      dia +
      "-" +
      mes +
      "-audio.mp3";

    const drive = getDriveClient();
    const nomeSeguro = escaparQuery(nomeArquivo);

    const existentes = await drive.files.list({
      q: [
        `'${pasta.clientFolderId}' in parents`,
        `name = '${nomeSeguro}'`,
        "trashed = false",
      ].join(" and "),
      fields: "files(id,name)",
      pageSize: 10,
    });

    const existente = existentes.data.files?.[0];
    const auth = getGoogleDriveAuth();
    const accessToken = await auth.getAccessToken();

    if (!accessToken.token) {
      throw new Error("Nao foi possivel autenticar no Google Drive.");
    }

    const baseUpload =
      "https://www.googleapis.com/upload/drive/v3/files";

    const url = existente?.id
      ? `${baseUpload}/${existente.id}?uploadType=resumable&fields=id,name,webViewLink`
      : `${baseUpload}?uploadType=resumable&fields=id,name,webViewLink`;

    const respostaGoogle = await fetch(url, {
      method: existente?.id ? "PATCH" : "POST",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": "audio/mpeg",
        "X-Upload-Content-Length": String(tamanho),
      },
      body: existente?.id
        ? JSON.stringify({ name: nomeArquivo })
        : JSON.stringify({
            name: nomeArquivo,
            parents: [pasta.clientFolderId],
          }),
    });

    if (!respostaGoogle.ok) {
      const detalhe = await respostaGoogle.text();
      throw new Error(
        `Google Drive recusou o inicio do upload: ${detalhe}`
      );
    }

    const uploadUrl = respostaGoogle.headers.get("location");

    if (!uploadUrl) {
      throw new Error(
        "Google Drive nao retornou a URL para envio do audio."
      );
    }

    return NextResponse.json({
      ok: true,
      uploadUrl,
      fileIdExistente: existente?.id || null,
      nomeArquivo,
      clientId: cliente.id,
      slug,
      ano: pasta.ano,
      mes: pasta.mes,
      semana: String(semana),
      folderId: pasta.clientFolderId,
    });
  } catch (error) {
    console.error("Erro ao iniciar upload manual do audio:", error);

    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro ao preparar o envio do audio.";

    return NextResponse.json(
      { error: mensagem },
      { status: 500 }
    );
  }
}
