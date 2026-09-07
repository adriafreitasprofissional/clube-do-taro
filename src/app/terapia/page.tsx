"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TerapiaInicioPage() {
  const router = useRouter();

  useEffect(() => {
    const token =
      window.localStorage.getItem(
        "terapia_em_dia_access_token"
      );

    if (token) {
      router.replace(
        `/terapia/acesso/${token}`
      );
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-12 text-[#5E7357]">
      <div className="mx-auto max-w-xl">
        <div className="rounded-[32px] border border-[#DCCFB8] bg-[#F7F1E4] p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#8AA27A] text-2xl font-black text-white shadow-lg">
            TE
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-[#8AA27A]">
            Terapia em Dia
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            com Ádria Freitas
          </h1>

          <p className="mt-5 text-sm leading-7 text-[#6C8465]">
            Para acessar seu espaço individual,
            abra o link pessoal enviado pela Ádria.
          </p>
        </div>
      </div>
    </main>
  );
}
