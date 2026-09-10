"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ContentLink = {
  title: string;
  url: string;
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

  session_title?: string | null;
  evolution_summary?: string | null;
  client_report?: string | null;
  client_activity?: string | null;
  published_to_client?: boolean;
  completed_at?: string | null;

  content_links?: ContentLink[];
};

function normalizarStatus(
  valor?: string | null
) {
  return (valor || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function concluido(item: Atendimento) {
  const status =
    normalizarStatus(item.status);

  return (
    Boolean(item.completed_at) ||
    status === "realizado" ||
    status === "concluido" ||
    status === "finalizado"
  );
}

function formatarData(valor: string) {
  return new Date(valor).toLocaleString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function AtendimentosPage() {
  const [atendimentos, setAtendimentos] =
    useState<Atendimento[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  const [busca, setBusca] =
    useState("");

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error(
            "Sessão administrativa expirada."
          );
        }

        const response = await fetch(
          "/api/admin/agenda",
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
              "Não foi possível carregar os atendimentos."
          );
        }

        setAtendimentos(
          Array.isArray(
            data?.atendimentos
          )
            ? data.atendimentos
            : []
        );
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar atendimentos."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  const agora = new Date();

  const sessoesPassadas =
    useMemo(() => {
      const termo =
        busca
          .toLowerCase()
          .trim();

      return atendimentos
        .filter((item) => {
          const status =
            normalizarStatus(
              item.status
            );

          if (status === "cancelado") {
            return false;
          }

          if (
            new Date(
              item.scheduled_at
            ) > agora
          ) {
            return false;
          }

          if (!termo) {
            return true;
          }

          return (
            item.client_name
              ?.toLowerCase()
              .includes(termo) ||
            item.service_type
              ?.toLowerCase()
              .includes(termo) ||
            item.session_title
              ?.toLowerCase()
              .includes(termo)
          );
        })
        .sort(
          (a, b) =>
            new Date(
              b.scheduled_at
            ).getTime() -
            new Date(
              a.scheduled_at
            ).getTime()
        );
    }, [atendimentos, busca]);

  const pendentes =
    sessoesPassadas.filter(
      (item) => !concluido(item)
    );

  const finalizados =
    sessoesPassadas.filter(
      concluido
    );

  const publicados =
    finalizados.filter(
      (item) =>
        item.published_to_client
    ).length;

  const comConteudo =
    finalizados.filter(
      (item) =>
        Array.isArray(
          item.content_links
        ) &&
        item.content_links.length > 0
    ).length;

  const cardResumo = [
    {
      label:
        "Sessões concluídas",
      valor:
        finalizados.length,
    },
    {
      label:
        "Precisam finalizar",
      valor:
        pendentes.length,
    },
    {
      label:
        "Publicadas no portal",
      valor:
        publicados,
    },
    {
      label:
        "Com conteúdos",
      valor:
        comConteudo,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* NAVEGAÇÃO */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Link
          href="/admin/terapia"
          className="text-sm font-bold text-[#cbd69d]"
        >
          ← Terapia em Dia
        </Link>

        <Link
          href="/admin"
          className="text-sm font-bold text-white/50 hover:text-white"
        >
          Central de Negócios
        </Link>
      </div>

      {/* TOPO */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b7c28b]">
            Gestão terapêutica
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-white">
            Atendimentos
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
            Sessões realizadas,
            registros terapêuticos,
            evolução, relatórios e
            conteúdos enviados para as
            pacientes.
          </p>
        </div>

        <Link
          href="/admin/terapia/agenda"
          className="rounded-xl border border-[#b7c28b]/30 bg-[#5c6c3d]/20 px-5 py-3 text-sm font-bold text-[#dce5c0] transition hover:bg-[#5c6c3d]/35"
        >
          Abrir Agenda
        </Link>
      </div>

      {/* RESUMO */}
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cardResumo.map(
          (card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-[#b7c28b]/15 bg-[linear-gradient(145deg,rgba(69,79,46,.26),rgba(28,32,21,.6))] p-5"
            >
              <p className="text-xs text-white/50">
                {card.label}
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {carregando
                  ? "—"
                  : card.valor}
              </p>
            </div>
          )
        )}
      </div>

      {/* BUSCA */}
      <div className="mt-7">
        <input
          type="text"
          value={busca}
          onChange={(e) =>
            setBusca(
              e.target.value
            )
          }
          placeholder="Buscar paciente, tipo de atendimento ou título da sessão..."
          className="w-full rounded-2xl border border-[#b7c28b]/20 bg-[#1b2015]/80 px-5 py-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#b7c28b]/50"
        />
      </div>

      {erro && (
        <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-sm text-red-200">
          {erro}
        </div>
      )}

      {/* PENDENTES */}
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Precisam ser finalizados
            </h2>

            <p className="mt-1 text-xs text-white/45">
              Sessões que já passaram,
              mas ainda não foram
              marcadas como concluídas.
            </p>
          </div>

          <span className="rounded-full bg-[#b7c28b]/10 px-3 py-1 text-xs font-bold text-[#cbd69d]">
            {pendentes.length}
          </span>
        </div>

        {carregando ? (
          <div className="rounded-2xl border border-[#b7c28b]/15 bg-[#1b2015]/70 p-5 text-sm text-white/50">
            Carregando...
          </div>
        ) : pendentes.length ===
          0 ? (
          <div className="rounded-2xl border border-[#b7c28b]/15 bg-[#1b2015]/70 p-5 text-sm text-white/50">
            Nenhuma sessão pendente.
          </div>
        ) : (
          <div className="grid gap-4">
            {pendentes.map(
              (item) => (
                <CardSessao
                  key={item.id}
                  item={item}
                  pendente
                />
              )
            )}
          </div>
        )}
      </section>

      {/* CONCLUÍDOS */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Histórico de atendimentos
            </h2>

            <p className="mt-1 text-xs text-white/45">
              Sessões concluídas e seus
              registros terapêuticos.
            </p>
          </div>

          <span className="rounded-full bg-[#b7c28b]/10 px-3 py-1 text-xs font-bold text-[#cbd69d]">
            {finalizados.length}
          </span>
        </div>

        {carregando ? (
          <div className="rounded-2xl border border-[#b7c28b]/15 bg-[#1b2015]/70 p-5 text-sm text-white/50">
            Carregando...
          </div>
        ) : finalizados.length ===
          0 ? (
          <div className="rounded-2xl border border-[#b7c28b]/15 bg-[#1b2015]/70 p-5 text-sm text-white/50">
            Nenhuma sessão concluída
            encontrada.
          </div>
        ) : (
          <div className="grid gap-4">
            {finalizados.map(
              (item) => (
                <CardSessao
                  key={item.id}
                  item={item}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function CardSessao({
  item,
  pendente = false,
}: {
  item: Atendimento;
  pendente?: boolean;
}) {
  const temRelatorio =
    Boolean(
      item.client_report?.trim()
    );

  const temEvolucao =
    Boolean(
      item.evolution_summary?.trim()
    );

  const qtdConteudos =
    Array.isArray(
      item.content_links
    )
      ? item.content_links.length
      : 0;

  return (
    <article className="rounded-2xl border border-[#b7c28b]/18 bg-[linear-gradient(145deg,rgba(61,70,42,.40),rgba(27,31,20,.88))] p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white">
              {item.client_name}
            </h3>

            {pendente ? (
              <span className="rounded-full bg-amber-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-200">
                Pendente
              </span>
            ) : (
              <span className="rounded-full bg-[#b7c28b]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#dce5c0]">
                Concluído
              </span>
            )}

            {item.published_to_client && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white/65">
                Portal publicado
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-[#cbd69d]">
            {item.session_title ||
              item.service_type}
          </p>

          <p className="mt-1 text-xs text-white/45">
            {formatarData(
              item.scheduled_at
            )}{" "}
            · {item.service_type} ·{" "}
            {item.duration_minutes} min
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Indicador
              ativo={temEvolucao}
              texto="Evolução"
            />

            <Indicador
              ativo={temRelatorio}
              texto="Relatório"
            />

            <Indicador
              ativo={
                qtdConteudos > 0
              }
              texto={
                qtdConteudos === 1
                  ? "1 conteúdo"
                  : `${qtdConteudos} conteúdos`
              }
            />

            <Indicador
              ativo={Boolean(
                item.client_activity
              )}
              texto="Atividade"
            />
          </div>
        </div>

        <Link
          href={`/admin/agenda/${item.id}/atendimento`}
          className={
            pendente
              ? "shrink-0 rounded-xl bg-[#b8c68a] px-5 py-3 text-center text-sm font-bold text-[#263019] transition hover:brightness-110"
              : "shrink-0 rounded-xl border border-[#b7c28b]/30 bg-[#5c6c3d]/15 px-5 py-3 text-center text-sm font-bold text-[#dce5c0] transition hover:bg-[#5c6c3d]/30"
          }
        >
          {pendente
            ? "Finalizar sessão"
            : "Abrir sessão"}
        </Link>
      </div>
    </article>
  );
}

function Indicador({
  ativo,
  texto,
}: {
  ativo: boolean;
  texto: string;
}) {
  return (
    <span
      className={
        ativo
          ? "rounded-lg border border-[#b7c28b]/20 bg-[#b7c28b]/10 px-2.5 py-1 text-[10px] font-semibold text-[#dce5c0]"
          : "rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-white/30"
      }
    >
      {ativo ? "✓ " : "— "}
      {texto}
    </span>
  );
}