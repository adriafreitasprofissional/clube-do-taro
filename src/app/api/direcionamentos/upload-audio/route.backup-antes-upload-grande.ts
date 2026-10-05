import { NextResponse } from "next/server";
import { garantirPastaAssinante, salvarArquivoDrive } from "@/lib/google-drive";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function bearerToken(req: Request) { const auth = req.headers.get("authorization") || ""; return auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : ""; }

function numeroSemanaDoMes(data: Date) { const primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1); const diaSemanaPrimeiro = (primeiroDia.getDay() + 6) % 7; return Math.ceil((data.getDate() + diaSemanaPrimeiro) / 7); }

export async function POST(req: Request) {
  try {
    const token = bearerToken(req);
    if (!token) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData.user?.email) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    const { data: operador, error: operadorError } = await supabaseAdmin.from("club_clients").select("id,email,role,status").eq("email", authData.user.email).maybeSingle();
    if (operadorError || !operador || !["admin", "profissional"].includes(operador.role)) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });

    const formData = await req.formData();
    const arquivo = formData.get("arquivo");
    const slug = String(formData.get("slug") || "").trim();
    const dataInicio = String(formData.get("dataInicio") || "").trim();
    const dataFim = String(formData.get("dataFim") || "").trim();

    if (!(arquivo instanceof File) || arquivo.size === 0) return NextResponse.json({ error: "Arquivo de áudio não informado." }, { status: 400 });
    if (!slug) return NextResponse.json({ error: "Consulente sem slug." }, { status: 400 });
    if (!dataInicio) return NextResponse.json({ error: "Data inicial da semana não informada." }, { status: 400 });
    if (arquivo.type && arquivo.type !== "audio/mpeg" && !arquivo.name.toLowerCase().endsWith(".mp3")) return NextResponse.json({ error: "Envie um arquivo MP3." }, { status: 400 });

    const { data: cliente, error: clienteError } = await supabaseAdmin.from("club_clients").select("id,slug,professional_id").eq("slug", slug).maybeSingle();
    if (clienteError) throw clienteError;
    if (!cliente?.id) return NextResponse.json({ error: "Consulente não encontrado." }, { status: 404 });
    if (operador.role === "profissional" && cliente.professional_id !== operador.id) return NextResponse.json({ error: "Acesso negado a este consulente." }, { status: 403 });

    const dataInicial = new Date(`${dataInicio}T12:00:00`);
    const dataFinal = dataFim ? new Date(`${dataFim}T12:00:00`) : new Date(dataInicial);
    if (!dataFim) dataFinal.setDate(dataFinal.getDate() + 6);
    const diferencaDias = Math.round((dataFinal.getTime() - dataInicial.getTime()) / 86400000);
    const data = new Date(dataInicial);
    data.setDate(data.getDate() + Math.floor(diferencaDias / 2));
    if (Number.isNaN(data.getTime())) return NextResponse.json({ error: "Data inicial inválida." }, { status: 400 });
    const semana = numeroSemanaDoMes(data);
    const pasta = await garantirPastaAssinante({ slug, data });
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const slugSeguro = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const nomeArquivo = "semana-" + semana + "-" + slugSeguro + "-" + dia + "-" + mes + "-audio.mp3";
    const buffer = Buffer.from(await arquivo.arrayBuffer());
    const arquivoDrive = await salvarArquivoDrive({ folderId: pasta.clientFolderId, nomeArquivo, mimeType: "audio/mpeg", buffer });
    if (!arquivoDrive.id) throw new Error("O áudio foi enviado ao Drive, mas o ID do arquivo não foi retornado.");
    const driveFileUrl = "https:" + "//drive.google.com/file/d/" + arquivoDrive.id + "/view";
    const agora = new Date().toISOString();
    const { error: resetError } = await supabaseAdmin.from("club_directional_assets").update({ ativo: false, released_at: null, updated_at: agora }).eq("client_id", cliente.id).eq("ano", pasta.ano).eq("mes", pasta.mes).eq("semana", String(semana)).in("tipo", ["pdf_individual", "audio_individual"]);
    if (resetError) throw resetError;
    const { error: assetError } = await supabaseAdmin.from("club_directional_assets").upsert({ client_id: cliente.id, slug, ano: pasta.ano, mes: pasta.mes, semana: String(semana), tipo: "audio_individual", titulo: semana + "ª Semana — Áudio", drive_file_id: arquivoDrive.id, drive_file_url: driveFileUrl, drive_folder_id: pasta.clientFolderId, ativo: false, released_at: null, updated_at: agora }, { onConflict: "client_id,ano,mes,semana,tipo" });
    if (assetError) throw assetError;
    return NextResponse.json({ ok: true, registrado: true, fileId: arquivoDrive.id, nomeArquivo });
  } catch (error) {
    console.error("Erro no upload manual do audio:", error);
    const mensagem = error instanceof Error ? error.message : "Erro ao enviar o audio.";
    return NextResponse.json({ error: mensagem }, { status: 500 });
  }
}
