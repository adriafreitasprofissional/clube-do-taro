"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function TerapiaEntrarPage() {
  const router = useRouter();

  const [erro, setErro] =
    useState<string | null>(null);

  useEffect(() => {
    async function abrirPortal() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          router.replace("/terapia");
          return;
        }

        const response = await fetch(
          "/api/terapia/acesso-logado",
          {
            cache: "no-store",
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Não foi possível abrir seu portal."
          );
        }

        window.localStorage.setItem(
          "terapia_em_dia_access_token",
          data.access_token
        );

        router.replace(
          `/terapia/acesso/${data.access_token}`
        );
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível abrir seu portal."
        );
      }
    }

    abrirPortal();
  }, [router]);

  if (erro) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] p-8">
        <div className="mx-auto max-w-md rounded-3xl border border-red-200 bg-white p-6 text-center text-red-700 shadow">
          {erro}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] p-8 text-center text-[#5E7357]">
      Abrindo seu espaço...
    </main>
  );
}