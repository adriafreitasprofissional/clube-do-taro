"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function TerapiaAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function entrar(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setErro(null);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

    if (error || !data.session?.access_token) {
      setErro("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    const response = await fetch(
      "/api/terapia/admin/me",
      {
        headers: {
          Authorization:
            `Bearer ${data.session.access_token}`,
        },
      }
    );

    if (!response.ok) {
      await supabase.auth.signOut();
      setErro(
        "Este usuário não possui acesso administrativo."
      );
      setLoading(false);
      return;
    }

    router.replace("/terapia/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F4EC] px-5 py-10">
      <form
        onSubmit={entrar}
        className="w-full max-w-md rounded-[32px] border border-[#DCCFB8] bg-[#F7F1E4] p-8 shadow-xl"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5E7357] font-black text-[#F8F4EC] shadow">
          TE
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#8AA27A]">
          Terapia em Dia
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#5E7357]">
          Administração
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#6C8465]">
          Acesso profissional de Ádria Freitas.
        </p>

        {erro && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {erro}
          </div>
        )}

        <label className="mt-7 block text-sm font-bold text-[#5E7357]">
          E-mail
        </label>

       <input
  type="email"
  required
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
  className="mt-2 w-full rounded-xl border border-[#C8B8A8] bg-white px-4 py-3 text-[#4F5E4A] outline-none focus:border-[#5E7357]"
/>

        <label className="mt-5 block text-sm font-bold text-[#5E7357]">
          Senha
        </label>

        <div className="relative mt-2">
          <input
            type={mostrarSenha ? "text" : "password"}
            required
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
           className="w-full rounded-xl border border-[#C8B8A8] bg-white px-4 py-3 pr-12 text-[#4F5E4A] outline-none focus:border-[#5E7357]"
          />

          <button
            type="button"
            onClick={() =>
              setMostrarSenha(!mostrarSenha)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-[#5E7357]"
            aria-label={
              mostrarSenha
                ? "Ocultar senha"
                : "Mostrar senha"
            }
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
    <circle cx="12" cy="12" r="2.5" />
  </svg>
)}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-xl bg-[#5E7357] px-5 py-3 font-bold text-[#F8F4EC] shadow transition hover:bg-[#4F6548] disabled:opacity-60"
        >
          {loading
            ? "Entrando..."
            : "Entrar no ADM"}
        </button>
      </form>
    </main>
  );
}
