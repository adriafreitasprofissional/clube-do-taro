import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Sessão não encontrada." },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Sessão inválida." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const slug = (url.searchParams.get("slug") || "")
      .toLowerCase()
      .trim();

    if (!slug) {
      return NextResponse.json(
        { error: "Slug não informado." },
        { status: 400 }
      );
    }

    const {
      data: cliente,
      error: clienteError,
    } = await supabaseAdmin
      .from("club_clients")
      .select("id,slug,email")
      .eq("slug", slug)
      .maybeSingle();

    if (clienteError) {
      throw clienteError;
    }

    if (!cliente) {
      return NextResponse.json(
        { error: "Assinante não encontrada." },
        { status: 404 }
      );
    }

    const emailUsuario =
      String(user.email || "").toLowerCase().trim();

    const emailCliente =
      String(cliente.email || "").toLowerCase().trim();

    const ehPropriaAssinante =
      user.id === cliente.id ||
      (emailUsuario &&
        emailCliente &&
        emailUsuario === emailCliente);

    let ehAdmin = false;

    if (!ehPropriaAssinante && emailUsuario) {
      const {
        data: admin,
        error: adminError,
      } = await supabaseAdmin
        .from("club_clients")
        .select("id")
        .eq("email", emailUsuario)
        .eq("role", "admin")
        .eq("status", "ativo")
        .maybeSingle();

      if (adminError) {
        throw adminError;
      }

      ehAdmin = Boolean(admin);
    }

    if (!ehPropriaAssinante && !ehAdmin) {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 403 }
      );
    }

    const {
      data: conteudos,
      error: conteudosError,
    } = await supabaseAdmin
      .from("club_directional_assets")
      .select(
        "slug,ano,mes,semana,tipo,titulo,drive_file_id,drive_file_url,ativo,released_at"
      )
      .eq("client_id", cliente.id)
      .eq("ativo", true)
      .order("ano", { ascending: false })
      .order("mes", { ascending: false })
      .order("semana", { ascending: true });

    if (conteudosError) {
      throw conteudosError;
    }

    return NextResponse.json({
      success: true,
      conteudos: conteudos || [],
    });
  } catch (error) {
    console.error(
      "Erro ao carregar direcionamentos:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar direcionamentos.",
      },
      { status: 500 }
    );
  }
}
