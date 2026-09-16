"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function esperar(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

export default function TerapiaEntrarPage() {
  const router = useRouter();

  const [erro, setErro] =
    useState<string | null>(null);

  const [tentando, setTentando] =
    useState(true);

  const abrirPortal =
    useCallback(async () => {
      setErro(null);
      setTentando(true);

      try {
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session?.access_token) {
          router.replace("/terapia");
          return;
        }

        let ultimoErro:
          unknown = null;

        for (
          let tentativa = 1;
          tentativa <= 3;
          tentativa++
        ) {
          try {
            const response =
              await fetch(
                "/api/terapia/acesso-logado",
                {
                  cache: "no-store",
                  headers: {
                    Authorization:
                      `Bearer ${session.access_token}`,
                  },
                }
              );

            const data =
              await response.json();

            if (!response.ok) {
              throw new Error(
                data?.error ||
                  "Não foi possível abrir seu espaço."
              );
            }

            if (
              data.tipo === "admin"
            ) {
              router.replace(
                "/terapia/admin"
              );
              return;
            }

            window.localStorage.setItem(
              "terapia_em_dia_access_token",
              data.access_token
            );

            router.replace(
              `/terapia/acesso/${data.access_token}`
            );

            return;
          } catch (error) {
            ultimoErro = error;

            if (tentativa < 3) {
              await esperar(
                tentativa === 1
                  ? 700
                  : 1400
              );
            }
          }
        }

        throw ultimoErro;
      } catch (error) {
        const mensagem =
          error instanceof Error
            ? error.message
            : "";

        const erroDeRede =
          mensagem
            .toLowerCase()
            .includes("network") ||
          mensagem
            .toLowerCase()
            .includes("fetch");

        setErro(
          erroDeRede
            ? "Não conseguimos abrir seu espaço agora. Verifique sua internet e toque em “Tentar novamente”."
            : mensagem ||
                "Não foi possível abrir seu espaço."
        );
      } finally {
        setTentando(false);
      }
    }, [router]);

  useEffect(() => {
    abrirPortal();
  }, [abrirPortal]);

  if (erro) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F4EC] p-6">
        <div className="w-full max-w-md rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6 text-center shadow-lg">
          <p className="text-lg font-extrabold text-[#5E7357]">
            Não foi possível abrir seu espaço
          </p>

          <p className="mt-3 text-sm leading-6 text-[#6C8465]">
            {erro}
          </p>

          <button
            type="button"
            onClick={abrirPortal}
            className="mt-5 w-full rounded-xl bg-[#5E7357] px-5 py-3 font-bold text-white"
          >
            Tentar novamente
          </button>

          <button
            type="button"
            onClick={() =>
              router.replace("/terapia")
            }
            className="mt-3 w-full rounded-xl border border-[#C8B8A8] px-5 py-3 font-bold text-[#5E7357]"
          >
            Voltar ao login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] p-8 text-center text-[#5E7357]">
      {tentando
        ? "Abrindo seu espaço..."
        : "Preparando seu acesso..."}
    </main>
  );
}
