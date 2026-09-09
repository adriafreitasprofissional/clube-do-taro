"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function TerapiaInicioPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] =
    useState(false);
  const [carregando, setCarregando] =
    useState(false);
  const [erro, setErro] =
    useState<string | null>(null);

  async function entrar() {
    if (!email || !senha) {
      setErro("Preencha seu e-mail e sua senha.");
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });

      if (error) {
        throw new Error(
          "E-mail ou senha incorretos."
        );
      }

      router.push("/terapia/entrar");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível entrar."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-12 text-[#5E7357]">
      <div className="mx-auto max-w-md">
        <div className="rounded-[32px] border border-[#DCCFB8] bg-[#F7F1E4] p-8 shadow-xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8AA27A]">
              Terapia em Dia
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              com Ádria Freitas
            </h1>

            <p className="mt-4 text-sm leading-7 text-[#6C8465]">
              Acesse seu espaço terapêutico
              usando o mesmo e-mail e senha
              do Clube do Tarô.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="seuemail@exemplo.com"
                className="mt-2 w-full rounded-xl border border-[#C8B8A8] bg-white px-4 py-3 text-[#4F5E4A] outline-none focus:border-[#5E7357]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Senha
              </label>

              <div className="relative mt-2">
                <input
                  type={
                    mostrarSenha
                      ? "text"
                      : "password"
                  }
                  value={senha}
                  onChange={(e) =>
                    setSenha(e.target.value)
                  }
                  placeholder="Sua senha"
                  className="w-full rounded-xl border border-[#C8B8A8] bg-white px-4 py-3 pr-12 text-[#4F5E4A] outline-none focus:border-[#5E7357]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarSenha(
                      !mostrarSenha
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5E7357]"
                  aria-label="Mostrar ou ocultar senha"
                >
                  {mostrarSenha ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                      <path d="M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9 5 9 5a16 16 0 01-2.1 2.7" />
                      <path d="M6.6 6.6C4.4 8.1 3 10 3 10s3.5 5 9 5a10.8 10.8 0 004.1-.8" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {erro && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
              </div>
            )}

            <button
              type="button"
              onClick={entrar}
              disabled={carregando}
              className="w-full rounded-xl bg-[#5E7357] px-5 py-3 font-bold text-white transition hover:bg-[#769566] disabled:opacity-60"
            >
              {carregando
                ? "Entrando..."
                : "Entrar"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}