"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type ProximoAtendimento = {
  id: string;
  service_type: string;
  professional: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  meet_url: string | null;
};

type PortalData = {
  cliente: {
    id: string;
    nome: string;
    nome_completo: string;
    email: string;
    slug: string;
  };

  professional: string;

  proximo_atendimento:
    | ProximoAtendimento
    | null;

  anamnese: {
    preenchida: boolean;
    status: string | null;
    submitted_at: string | null;
  };
};

function formatarDataHora(
  iso?: string | null
) {
  if (!iso) return "";

  const data = new Date(iso);

  return data.toLocaleString(
    "pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function TerapiaPortalPage() {
  const params = useParams();
  const token = String(
    params?.token || ""
  );

  const [dados, setDados] =
    useState<PortalData | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    window.localStorage.setItem(
      "terapia_em_dia_access_token",
      token
    );

    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        const response = await fetch(
          `/api/terapia/portal?token=${encodeURIComponent(
            token
          )}`,
          {
            cache: "no-store",
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

        setDados(data);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível abrir seu espaço."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [token]);

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] p-8 text-center text-[#6C8465]">
        Preparando seu espaço...
      </main>
    );
  }

  if (erro || !dados) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] p-8">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-7 text-center text-red-700 shadow">
          {erro ||
            "Não foi possível abrir seu espaço."}
        </div>
      </main>
    );
  }

  const proximo =
    dados.proximo_atendimento;

  return (
    <main className="min-h-screen bg-[#F8F4EC] text-[#4F5E4A]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col md:flex-row">
        <aside className="border-b border-[#DCCFB8] bg-[#F7F1E4] p-6 md:w-72 md:border-b-0 md:border-r">
          <div className="md:sticky md:top-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8AA27A] font-black text-white shadow">
                TE
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8AA27A]">
                  Terapia em Dia
                </p>

                <p className="mt-1 text-sm font-semibold text-[#5E7357]">
                  com Ádria Freitas
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[#DCCFB8] bg-white p-5">
              <p className="text-xs uppercase tracking-wide text-[#6C8465]">
                Seu espaço
              </p>

              <p className="mt-2 text-xl font-bold">
                {dados.cliente.nome}
              </p>

              <p className="mt-2 text-xs leading-5 text-[#6C8465]">
                Acompanhamento individual
                e confidencial.
              </p>
            </div>

            <nav className="mt-6 grid gap-2">
              <Link
                href={`/terapia/acesso/${token}`}
                className="rounded-xl bg-[#8AA27A] px-4 py-3 text-sm font-bold text-white shadow"
              >
                Meu Portal
              </Link>

              <Link
                href={`/terapia/acesso/${token}/anamnese`}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#5E7357] transition hover:bg-[#EFE5D3]"
              >
                Minha Anamnese
              </Link>
            </nav>
          </div>
        </aside>

        <section className="flex-1 px-5 py-8 md:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold text-[#8AA27A]">
              Seu acompanhamento começa aqui
            </p>

            <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Bem-vinda, {dados.cliente.nome}.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6C8465] md:text-base">
              Este é o seu espaço de acompanhamento
              com Ádria Freitas. Aqui você poderá
              organizar sua jornada, acessar suas
              sessões e acompanhar as próximas etapas.
            </p>

            {proximo && (
              <div className="mt-8 overflow-hidden rounded-3xl border border-[#DCCFB8] bg-gradient-to-br from-[#8AA27A] to-[#5E7357] p-6 text-white shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-100">
                  Próximo encontro
                </p>

                <h2 className="mt-3 text-2xl font-bold">
                  {proximo.service_type}
                </h2>

                <p className="mt-2 capitalize text-sm leading-6 text-orange-50">
                  {formatarDataHora(
                    proximo.scheduled_at
                  )}
                </p>

                <p className="mt-1 text-xs text-orange-100">
                  {proximo.duration_minutes} minutos
                </p>

                {proximo.meet_url ? (
                  <a
                    href={proximo.meet_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#5E7357] shadow transition hover:bg-orange-50"
                  >
                    Entrar na sessão
                  </a>
                ) : (
                  <p className="mt-5 inline-flex rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-xs font-semibold text-orange-50">
                    O acesso à sala será liberado
                    antes do encontro.
                  </p>
                )}
              </div>
            )}

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Link
                href={`/terapia/acesso/${token}/anamnese`}
                className={`rounded-3xl border p-6 shadow-lg transition hover:-translate-y-1 ${
                  dados.anamnese.preenchida
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-[#DCCFB8] bg-white hover:border-[#8AA27A]"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE5D3] text-xl">
                  📝
                </div>

                <h2 className="mt-4 text-xl font-extrabold">
                  Minha Anamnese
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6C8465]">
                  {dados.anamnese.preenchida
                    ? "Sua anamnese foi recebida pela Ádria."
                    : "Preencha suas informações antes do primeiro encontro."}
                </p>

                <p
                  className={`mt-5 text-sm font-bold ${
                    dados.anamnese.preenchida
                      ? "text-emerald-700"
                      : "text-[#8AA27A]"
                  }`}
                >
                  {dados.anamnese.preenchida
                    ? "✓ Anamnese preenchida"
                    : "Preencher agora →"}
                </p>
              </Link>

              <div className="rounded-3xl border border-[#DCCFB8] bg-white p-6 shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE5D3] text-xl">
                  🌿
                </div>

                <h2 className="mt-4 text-xl font-extrabold">
                  Minha Jornada
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6C8465]">
                  Sessões, atividades, materiais
                  e sua evolução ficarão organizados
                  aqui durante o acompanhamento.
                </p>

                <p className="mt-5 text-xs font-bold uppercase tracking-wide text-[#6C8465]">
                  Em construção
                </p>
              </div>

              <div className="rounded-3xl border border-[#DCCFB8] bg-white p-6 shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE5D3] text-xl">
                  📅
                </div>

                <h2 className="mt-4 text-xl font-extrabold">
                  Minha Agenda
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6C8465]">
                  {proximo
                    ? `Seu próximo encontro está marcado para ${formatarDataHora(
                        proximo.scheduled_at
                      )}.`
                    : "Nenhum próximo encontro encontrado."}
                </p>
              </div>

              <div className="rounded-3xl border border-[#DCCFB8] bg-white p-6 shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE5D3] text-xl">
                  ✦
                </div>

                <h2 className="mt-4 text-xl font-extrabold">
                  Recados da Ádria
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6C8465]">
                  Este espaço receberá orientações
                  e recados relacionados ao seu
                  acompanhamento.
                </p>

                <p className="mt-5 text-xs font-bold uppercase tracking-wide text-[#6C8465]">
                  Em breve
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6">
              <p className="text-sm font-bold text-[#8AA27A]">
                Privacidade
              </p>

              <p className="mt-2 text-xs leading-6 text-[#6C8465]">
                Seu link de acesso é individual.
                Não encaminhe este endereço para
                outras pessoas.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
