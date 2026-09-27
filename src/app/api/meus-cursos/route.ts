import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization") || "";
    const token = authorization.startsWith("Bearer ")
      ? authorization.slice(7).trim()
      : "";

    if (!token) {
      return NextResponse.json(
        { error: "Sessão não encontrada." },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Sessão inválida." },
        { status: 401 }
      );
    }

    // Primeiro procura pelo ID do usuário autenticado.
    // Esse ID corresponde ao club_client_id nos cadastros atuais.
    let { data: liberados, error: liberadosError } = await supabaseAdmin
      .from("course_students")
      .select("course_id, slug")
      .eq("club_client_id", user.id)
      .eq("status", "ativo");

    if (liberadosError) {
      throw liberadosError;
    }

    // Compatibilidade com matrículas antigas vinculadas somente pelo e-mail.
    if ((!liberados || liberados.length === 0) && user.email) {
      const resultadoEmail = await supabaseAdmin
        .from("course_students")
        .select("course_id, slug")
        .ilike("email", user.email)
        .eq("status", "ativo");

      if (resultadoEmail.error) {
        throw resultadoEmail.error;
      }

      liberados = resultadoEmail.data;
    }

    if (!liberados?.length) {
      return NextResponse.json({
        cursos: [],
        slugAluno: "",
      });
    }

    const ids = [
      ...new Set(
        liberados
          .map((item) => item.course_id)
          .filter((id): id is string => Boolean(id))
      ),
    ];

    const { data: cursos, error: cursosError } = await supabaseAdmin
      .from("courses")
      .select("*")
      .in("id", ids)
      .eq("published", true);

    if (cursosError) {
      throw cursosError;
    }

    return NextResponse.json({
      cursos: cursos || [],
      slugAluno: liberados[0]?.slug || "",
    });
  } catch (error) {
    console.error("ERRO AO CARREGAR CURSOS:", error);

    return NextResponse.json(
      { error: "Não foi possível carregar os cursos." },
      { status: 500 }
    );
  }
}