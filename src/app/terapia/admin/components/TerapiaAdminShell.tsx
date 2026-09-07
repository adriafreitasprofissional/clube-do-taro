"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const itens = [
  ["/terapia/admin", "Visão Geral", "⌂"],
  ["/terapia/admin/clientes", "Clientes", "●"],
  ["/terapia/admin/anamneses", "Anamneses", "✎"],
  ["/terapia/admin/disponibilidade", "Disponibilidade", "◷"],
] as const;

const futuros = [
  "Agenda",
  "Sessões",
  "Financeiro",
  "Cursos",
  "Loja",
  "Benefícios",
];

export default function TerapiaAdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const login =
    pathname === "/terapia/admin/login";

  const [carregando, setCarregando] =
    useState(!login);

  const [menuAberto, setMenuAberto] =
    useState(false);

  useEffect(() => {
    if (login) {
      setCarregando(false);
      return;
    }

    async function validar() {
      const { data: { session } } =
        await supabase.auth.getSession();

      if (!session?.access_token) {
        router.replace(
          "/terapia/admin/login"
        );
        return;
      }

      const response = await fetch(
        "/api/terapia/admin/me",
        {
          cache: "no-store",
          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        await supabase.auth.signOut();
        router.replace(
          "/terapia/admin/login"
        );
        return;
      }

      setCarregando(false);
    }

    validar();
  }, [login, router]);

  async function sair() {
    await supabase.auth.signOut();
    router.replace(
      "/terapia/admin/login"
    );
  }

  if (login) {
    return <>{children}</>;
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] p-8 text-center text-[#5E7357]">
        Abrindo Terapia em Dia...
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#4F5E4A]">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#DCCFB8] bg-[#F7F1E4]/95 px-4 py-4 backdrop-blur md:hidden">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8AA27A]">
            Terapia em Dia
          </p>
          <p className="text-sm font-extrabold text-[#5E7357]">
            Ádria Freitas
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setMenuAberto(true)
          }
          className="rounded-xl border border-[#A9B89E] px-4 py-2 text-sm font-bold text-[#5E7357]"
        >
          Menu
        </button>
      </header>

      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() =>
            setMenuAberto(false)
          }
          className="fixed inset-0 z-40 bg-black/35 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[286px] border-r border-[#DCCFB8] bg-[#F7F1E4] p-5 transition-transform md:translate-x-0 ${
          menuAberto
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5E7357] font-black text-[#F8F4EC] shadow">
            TE
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#8AA27A]">
            Terapia em Dia
          </p>

          <h1 className="mt-1 text-xl font-extrabold text-[#5E7357]">
            Ádria Freitas
          </h1>

          <p className="mt-1 text-xs text-[#7A8D73]">
            Administração Terapêutica
          </p>
        </div>

        <nav className="mt-8 grid gap-1">
          {itens.map(
            ([href, label, icon]) => {
              const active =
                href === "/terapia/admin"
                  ? pathname ===
                    "/terapia/admin"
                  : pathname.startsWith(
                      href
                    );

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() =>
                    setMenuAberto(false)
                  }
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#5E7357] text-[#F8F4EC] shadow"
                      : "text-[#5E7357] hover:bg-[#E9E4D7]"
                  }`}
                >
                  <span className="w-5 text-center">
                    {icon}
                  </span>
                  <span>{label}</span>
                </Link>
              );
            }
          )}

          <div className="my-3 border-t border-[#DDD2C2]" />

          {futuros.map((label) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#9AA493]"
              title="Integração na próxima etapa"
            >
              <span className="w-5 text-center">
                ·
              </span>
              <span>{label}</span>
            </div>
          ))}
        </nav>

        <button
          type="button"
          onClick={sair}
          className="absolute bottom-5 left-5 right-5 rounded-xl border border-[#C8B8A8] px-4 py-3 text-sm font-bold text-[#6C8465] transition hover:bg-[#E9E4D7]"
        >
          Sair
        </button>
      </aside>

      <main className="min-h-screen px-4 py-7 md:ml-[286px] md:px-8 md:py-9 xl:px-10">
        {children}
      </main>
    </div>
  );
}
