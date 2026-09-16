import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ROLES_PERMITIDAS = new Set([
  "admin",
  "terapeuta",
  "therapist",
  "profissional",
]);

export async function getTherapyAdmin(
  request: NextRequest
) {
  const authorization =
    request.headers.get("authorization") || "";

  const token =
    authorization.startsWith("Bearer ")
      ? authorization
          .slice("Bearer ".length)
          .trim()
      : "";

  if (!token) return null;

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);

  if (!user?.email) return null;

  const { data: profissional } =
    await supabaseAdmin
      .from("club_clients")
      .select(
        "id, nome, nome_referencia, email, role"
      )
      .ilike("email", user.email)
      .maybeSingle();

  if (!profissional) return null;

  const role = String(
    profissional.role || ""
  )
    .toLowerCase()
    .trim();

  if (!ROLES_PERMITIDAS.has(role)) {
    return null;
  }

  const nomeCompleto =
    profissional.nome ||
    profissional.nome_referencia ||
    "Profissional";

  return {
    id: profissional.id,
    nome:
      profissional.nome_referencia ||
      profissional.nome ||
      "Profissional",
    nome_completo: nomeCompleto,
    email:
      profissional.email || user.email,
    role,
    professional: nomeCompleto,
    central_access: role === "admin",
  };
}
