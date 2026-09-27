import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
    if (!token) return NextResponse.json({ error: "Sessão não encontrada." }, { status: 401 });
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user?.email) return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
    const { data: liberados, error: liberadosError } = await supabaseAdmin.from("course_students").select("course_id, slug").ilike("email", user.email).eq("status", "ativo");
    if (liberadosError) throw liberadosError;
    if (!liberados?.length) return NextResponse.json({ cursos: [], slugAluno: "" });
    const ids = liberados.map((item) => item.course_id).filter(Boolean);
    const { data: cursos, error: cursosError } = await supabaseAdmin.from("courses").select("*").in("id", ids).eq("published", true);
    if (cursosError) throw cursosError;
    return NextResponse.json({ cursos: cursos || [], slugAluno: liberados[0]?.slug || "" });
  } catch (error) {
    console.error("ERRO AO CARREGAR CURSOS:", error);
    return NextResponse.json({ error: "Não foi possível carregar os cursos." }, { status: 500 });
  }
}
