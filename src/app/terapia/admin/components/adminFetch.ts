import { supabase } from "@/lib/supabase";

export async function adminFetch(
  input: string,
  init: RequestInit = {}
) {
  const { data: { session } } =
    await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error(
      "Sessão administrativa expirada."
    );
  }

  const headers = new Headers(
    init.headers
  );

  headers.set(
    "Authorization",
    `Bearer ${session.access_token}`
  );

  return fetch(input, {
    ...init,
    headers,
    cache: "no-store",
  });
}
