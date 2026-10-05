import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearerToken(req: Request) {
  const auth = req.headers.get("authorization") || "";
  return auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : "";
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

    const clientId = String(body?.clientId || "").trim();
    const slug = String(body?.slug || "").trim();
    const ano = String(body?.ano || "").trim();
    const mes = String(body?.mes || "").trim();
    const semana = String(body?.semana || "").trim();
    const folderId = String(body?.folderId || "").trim();
    const fileId = String(body?.fileId || "").trim();

    if (
      !clientId ||
      !slug ||
      !ano ||
      !mes ||
      !semana ||
      !folderId ||
      !fileId
    ) {
      return NextResponse.json(
        { error: "Dados do audio incompletos." },
        { status: 400 }
      );
    }

    const { data: cliente, error: clienteError } = await supabaseAdmin
      .from("club_clients")
      .select("id,slug,professional_id")
      .eq("id", clientId)
      .eq("slug", slug)
      .maybeSingle();

    if (clienteError) throw clienteError;

    if (!cliente) {
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

    const agora = new Date().toISOString();

    const { error: resetError } = await supabaseAdmin
      .from("club_directional_assets")
      .update({
        ativo: false,
        released_at: null,
        updated_at: agora,
      })
      .eq("client_id", cliente.id)
      .eq("ano", ano)
      .eq("mes", mes)
      .eq("semana", semana)
      .in("tipo", ["pdf_individual", "audio_individual"]);

    if (resetError) throw resetError;

    const driveFileUrl =
      `https://drive.google.com/file/d/${fileId}/view`;

    const { error: assetError } = await supabaseAdmin
      .from("club_directional_assets")
      .upsert(
        {
          client_id: cliente.id,
          slug,
          ano,
          mes,
          semana,
          tipo: "audio_individual",
          titulo: semana + "Âª Semana â€” Ãudio",
          drive_file_id: fileId,
          drive_file_url: driveFileUrl,
          drive_folder_id: folderId,
          ativo: false,
          released_at: null,
          updated_at: agora,
        },
        {
          onConflict: "client_id,ano,mes,semana,tipo",
        }
      );

    if (assetError) throw assetError;

    return NextResponse.json({
      ok: true,
      registrado: true,
      fileId,
    });
  } catch (error) {
    console.error("Erro ao finalizar upload manual do audio:", error);

    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro ao registrar o audio.";

    return NextResponse.json(
      { error: mensagem },
      { status: 500 }
    );
  }
}
