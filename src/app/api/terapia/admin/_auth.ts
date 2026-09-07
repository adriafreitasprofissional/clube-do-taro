import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getTherapyAdmin(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";

  if (!token) return null;

  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  if (!user?.email) return null;

  const { data: admin } = await supabaseAdmin
    .from("club_clients")
    .select("id, nome, nome_referencia, email")
    .ilike("email", user.email)
    .eq("role", "admin")
    .maybeSingle();

  if (!admin) return null;

  return {
    id: admin.id,
    nome: admin.nome_referencia || admin.nome || "Ádria",
    email: admin.email || user.email,
  };
}
