"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Paciente = {
  id: string;
  nome: string;
  nome_completo: string;
  email: string;
  slug: string;
  anamnese?: {
    id: string;
    status: string;
    submitted_at: string;
  } | null;
};

type Atendimento = {
  id: string;
  client_id: string;
  client_name: string;
  service_type: string;
  professional: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  meet_url?: string | null;
  amount?: number | null;
  charge_type?: string | null;
  evolution_summary?: string | null;
  client_activity?: string | null;
  client_report?: string | null;
  recording_url?: string | null;
  completed_at?: string | null;
};

type Quiz = {
  id: string;
  client_id: string;
  title: string;
  subtitle?: string | null;
  status: string;
  quiz_type: string;
  created_at: string;
  published_at?: string | null;
};

function formatarData(valor?: string | null) {
  if (!valor) return "—";

  return new Date(valor).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function textoStatus(status?: string | null) {
  const valor = String(status || "").toLowerCase();

  if (valor === "agendado") return "Agendado";
  if (valor === "concluido") return "Concluído";
  if (valor === "concluído") return "Concluído";
  if (valor === "realizado") return "Concluído";
  if (valor === "finalizado") return "Concluído";
  if (valor === "cancelado") return "Cancelado";

  return status || "—";
}

export default function PacienteDetalhePage() {
  const params = useParams();

  const clientId = String(
    Array.isArray(params.clientId)
      ? params.clientId[0]
      : params.clientId || ""
  );

  const [paciente, setPaciente] =
    useState<Paciente | null>(null);

  const [atendimentos, setAtendimentos] =
    useState<Atendimento[]>([]);

  const [quizzes, setQuizzes] =
    useState<Quiz[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      if (!clientId) return;

      setCarregando(true);
      setErro(null);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error(
            "Sessão administrativa expirada."
          );
        }

        const headers = {
          Authorization:
            `Bearer ${session.access_token}`,
        };

        const [
          respostaDashboard,
          respostaAgenda,
          respostaQuizzes,
        ] = await Promise.all([
          fetch(
            "/api/terapia/admin/dashboard",
            {
              cache: "no-store",
              headers,
            }
          ),

          fetch(
            "/api/admin/agenda",
            {
              cache: "no-store",
              headers,
            }
          ),

          fetch(
            `/api/admin/terapia/quizzes?client_id=${encodeURIComponent(
              clientId
            )}`,
            {
              cache: "no-store",
              headers,
            }
          ),
        ]);

        const dashboard =
          await respostaDashboard.json();

        const agenda =
          await respostaAgenda.json();

        const dadosQuizzes =
          await respostaQuizzes.json();

        if (!respostaDashboard.ok) {
          throw new Error(
            dashboard?.error ||
              "Não foi possível carregar a paciente."
          );
        }

        if (!respostaAgenda.ok) {
          throw new Error(
            agenda?.error ||
              "Não foi possível carregar os atendimentos."
          );
        }

        if (!respostaQuizzes.ok) {
          throw new Error(
            dadosQuizzes?.error ||
              "Não foi possível carregar os quizzes."
          );
        }

        const encontrada =
          (dashboard.clientes || []).find(
            (item: Paciente) =>
              item.id === clientId
          ) || null;

        if (!encontrada) {
          throw new Error(
            "Paciente não encontrada."
          );
        }

        setPaciente(encontrada);

        setAtendimentos(
          (agenda.atendimentos || []).filter(
            (item: Atendimento) =>
              item.client_id === clientId
          )
        );

        setQuizzes(
          dadosQuizzes.quizzes || []
        );
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar ficha da paciente."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [clientId]);

  const proximos = useMemo(() => {
    const agora = new Date();

    return atendimentos
      .filter((item) => {
        if (
          String(item.status).toLowerCase() ===
          "cancelado"
        ) {
          return false;
        }

        return (
          new Date(item.scheduled_at) >= agora &&
          !item.completed_at
        );
      })
      .sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime()
      );
  }, [atendimentos]);

  const concluidos = useMemo(() => {
    const agora = new Date();

    return atendimentos
      .filter((item) => {
        const status =
          String(item.status).toLowerCase();

        return (
          Boolean(item.completed_at) ||
          status === "concluido" ||
          status === "concluído" ||
          status === "realizado" ||
          status === "finalizado" ||
          new Date(item.scheduled_at) < agora
        );
      })
      .filter(
        (item) =>
          String(item.status).toLowerCase() !==
          "cancelado"
      )
      .sort(
        (a, b) =>
          new Date(b.scheduled_at).getTime() -
          new Date(a.scheduled_at).getTime()
      );
  }, [atendimentos]);

  const comEvolucao = useMemo(
    () =>
      concluidos.filter(
        (item) =>
          item.evolution_summary ||
          item.client_report
      ).length,
    [concluidos]
  );

  if (carregando) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-[#b7c28b]/20 bg-[#1b2015] p-6 text-[#cbd69d]">
          Carregando ficha da paciente...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl pb-12">
      <div className="mb-8 flex flex-wrap gap-5">
        <Link
          href="/admin/terapia/pacientes"
          className="text-sm font-bold text-[#cbd69d]"
        >
          ← Pacientes
        </Link>

        <Link
          href="/admin/terapia"
          className="text-sm font-bold text-[#b7c28b]"
        >
          Terapia em Dia
        </Link>

        <Link
          href="/admin"
          className="text-sm font-bold text-white/50"
        >
          Central de Negócios
        </Link>
      </div>

      {erro && (
        <div className="rounded-2xl border border-red-400/25 bg-red-400/10 p-5 text-red-200">
          {erro}
        </div>
      )}

      {!erro && paciente && (
        <>
          <section className="rounded-3xl border border-[#b7c28b]/20 bg-gradient-to-br from-[#3d462a]/90 to-[#1b1f14] p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b7c28b]">
                  Ficha da paciente
                </p>

                <h1 className="mt-2 text-3xl font-semibold text-white">
                  {paciente.nome}
                </h1>

                {paciente.nome_completo &&
                  paciente.nome_completo !==
                    paciente.nome && (
                    <p className="mt-1 text-sm text-white/45">
                      {paciente.nome_completo}
                    </p>
                  )}

                {paciente.email && (
                  <p className="mt-3 text-sm text-white/55">
                    {paciente.email}
                  </p>
                )}
              </div>

              <span className="rounded-full border border-[#b7c28b]/25 bg-[#b7c28b]/10 px-4 py-2 text-xs font-bold text-[#dce5c0]">
                PACIENTE ATIVA
              </span>
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Resumo
              titulo="Próximas sessões"
              valor={String(proximos.length)}
            />

            <Resumo
              titulo="Sessões realizadas"
              valor={String(concluidos.length)}
            />

            <Resumo
              titulo="Evoluções registradas"
              valor={String(comEvolucao)}
            />

            <Resumo
              titulo="Quizzes / atividades"
              valor={String(quizzes.length)}
            />
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Link
              href={`/admin/terapia/anamneses/${paciente.id}`}
              className="rounded-2xl border border-[#b7c28b]/20 bg-[#1b2015] p-5 transition hover:border-[#b7c28b]/40"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-[#b7c28b]">
                Anamnese
              </p>

              <p className="mt-3 text-lg font-semibold text-white">
                {paciente.anamnese
                  ? "Ver anamnese"
                  : "Pendente"}
              </p>

              <p className="mt-2 text-xs leading-5 text-white/40">
                Histórico clínico e informações iniciais.
              </p>
            </Link>

            <Link
              href="/admin/terapia/quizzes"
              className="rounded-2xl border border-[#b7c28b]/20 bg-[#1b2015] p-5 transition hover:border-[#b7c28b]/40"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-[#b7c28b]">
                Quiz e atividades
              </p>

              <p className="mt-3 text-lg font-semibold text-white">
                {quizzes.length} registro(s)
              </p>

              <p className="mt-2 text-xs leading-5 text-white/40">
                Questionários e atividades da paciente.
              </p>
            </Link>

            <div className="rounded-2xl border border-[#b7c28b]/15 bg-[#161a12] p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#b7c28b]">
                Documentos
              </p>

              <p className="mt-3 text-lg font-semibold text-white">
                Em organização
              </p>

              <p className="mt-2 text-xs leading-5 text-white/40">
                Anamneses, relatórios e arquivos ficarão aqui.
              </p>
            </div>

            <div className="rounded-2xl border border-[#b7c28b]/15 bg-[#161a12] p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#b7c28b]">
                Financeiro
              </p>

              <p className="mt-3 text-lg font-semibold text-white">
                Em organização
              </p>

              <p className="mt-2 text-xs leading-5 text-white/40">
                Pacotes, sessões e pagamentos da paciente.
              </p>
            </div>
          </section>

          <section className="mt-9">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b7c28b]">
                  Agenda da paciente
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Próximos compromissos
                </h2>
              </div>

              <Link
                href="/admin/terapia/agenda"
                className="rounded-xl border border-[#b7c28b]/25 px-4 py-2 text-xs font-bold text-[#cbd69d]"
              >
                Abrir Agenda
              </Link>
            </div>

            {proximos.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-[#161a12] p-5 text-sm text-white/40">
                Nenhum próximo atendimento.
              </div>
            ) : (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {proximos.map((item) => (
                  <AtendimentoCard
                    key={item.id}
                    item={item}
                    futuro
                  />
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b7c28b]">
                Histórico
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Sessões realizadas
              </h2>
            </div>

            {concluidos.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-[#161a12] p-5 text-sm text-white/40">
                Nenhuma sessão concluída.
              </div>
            ) : (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {concluidos.map((item) => (
                  <AtendimentoCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Resumo({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#b7c28b]/15 bg-[#1b2015] p-5">
      <p className="text-xs uppercase tracking-wide text-white/40">
        {titulo}
      </p>

      <p className="mt-2 text-2xl font-semibold text-[#dce5c0]">
        {valor}
      </p>
    </div>
  );
}

function AtendimentoCard({
  item,
  futuro = false,
}: {
  item: Atendimento;
  futuro?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-[#b7c28b]/15 bg-[#1b2015] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">
            {item.service_type || "Atendimento"}
          </p>

          <p className="mt-1 text-sm text-white/45">
            {formatarData(item.scheduled_at)}
          </p>
        </div>

        <span className="rounded-full bg-[#5c6c3d]/20 px-3 py-1 text-[11px] font-bold text-[#cbd69d]">
          {textoStatus(item.status)}
        </span>
      </div>

      {item.evolution_summary && (
        <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.025] p-4">
          <p className="text-xs uppercase tracking-wide text-[#b7c28b]">
            Evolução
          </p>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/55">
            {item.evolution_summary}
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/admin/agenda/${item.id}/atendimento`}
          className="rounded-xl bg-[#b8c68a] px-4 py-2 text-xs font-bold text-[#263019]"
        >
          {futuro
            ? "Abrir atendimento"
            : "Ver atendimento"}
        </Link>

        {item.meet_url && futuro && (
          <a
            href={item.meet_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-[#b7c28b]/30 px-4 py-2 text-xs font-bold text-[#dce5c0]"
          >
            Entrar no Meet
          </a>
        )}

        {item.recording_url && (
          <a
            href={item.recording_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-white/60"
          >
            Ver gravação
          </a>
        )}
      </div>
    </article>
  );
}