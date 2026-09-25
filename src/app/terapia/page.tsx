"use client";

import { useState } from "react";
import Image from "next/image";
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
      setErro(
        "Preencha seu e-mail e sua senha."
      );
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
          error.message || "Não foi possível entrar."
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
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-10 text-[#5E7357]">
      <div className="mx-auto max-w-md">
        <div className="rounded-[32px] border border-[#DCCFB8] bg-[#F7F1E4] p-7 shadow-xl sm:p-8">
          <div className="text-center">
            <Image
              src="/terapia-icon-512-v2.png"
              alt="Terapia em Dia"
              width={150}
              height={150}
              priority
              className="mx-auto rounded-full"
            />

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#8AA27A]">
              Terapia em Dia
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              com Ádria Freitas
            </h1>

            <p className="mt-4 text-sm leading-7 text-[#6C8465]">
              Acesse seu espaço terapêutico com seu e-mail e senha cadastrados.
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
                autoComplete="username"
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
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#C8B8A8] bg-white px-4 py-3 pr-16 text-[#4F5E4A] outline-none focus:border-[#5E7357]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarSenha(
                      !mostrarSenha
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5E7357]"
                >
                  {mostrarSenha
                    ? "Ocultar"
                    : "Ver"}
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
