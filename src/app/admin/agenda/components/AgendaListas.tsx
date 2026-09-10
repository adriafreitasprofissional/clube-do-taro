"use client";

import { useMemo, useState } from "react";
import type { AgendaAtendimento } from "./agenda-types";

type Props = {
  atendimentos: AgendaAtendimento[];
  carregando?: boolean;

  onEditar: (item: AgendaAtendimento) => void;
  onRemarcar: (item: AgendaAtendimento) => void;
  onCancelar: (item: AgendaAtendimento) => void;
  onExcluir: (item: AgendaAtendimento) => void;
  onAtender: (item: AgendaAtendimento) => void;
};

type GrupoPaciente = {
  id: string;
  nome: string;
  atendimentos: AgendaAtendimento[];
};

function formatarData(item: AgendaAtendimento) {
  const data = new Date(item.scheduled_at);

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusNormalizado(status?: string | null) {
  return (status || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function atendimentoConcluido(item: AgendaAtendimento) {
  const status = statusNormalizado(item.status);

  return (
    Boolean(item.completed_at) ||
    status === "realizado" ||
    status === "concluido" ||
    status === "finalizado"
  );
}

function agruparPorPaciente(
  itens: AgendaAtendimento[]
): GrupoPaciente[] {
  const grupos = new Map<string, GrupoPaciente>();

  itens.forEach((item) => {
    const chave =
      item.client_id ||
      item.client_name.toLowerCase().trim();

    const existente = grupos.get(chave);

    if (existente) {
      existente.atendimentos.push(item);
      return;
    }

    grupos.set(chave, {
      id: chave,
      nome: item.client_name || "Paciente",
      atendimentos: [item],
    });
  });

  return Array.from(grupos.values()).sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR")
  );
}

function CardAtendimento({
  item,
  futuro,
  onEditar,
  onRemarcar,
  onCancelar,
  onExcluir,
  onAtender,
}: {
  item: AgendaAtendimento;
  futuro: boolean;
  onEditar: (item: AgendaAtendimento) => void;
  onRemarcar: (item: AgendaAtendimento) => void;
  onCancelar: (item: AgendaAtendimento) => void;
  onExcluir: (item: AgendaAtendimento) => void;
  onAtender: (item: AgendaAtendimento) => void;
}) {
  return (
    <div className="rounded-xl border border-purple-500/25 bg-[#1d0023] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">
            {item.service_type}
          </p>

          <p className="mt-1 text-xs text-purple-300/80">
            {item.professional} · {item.duration_minutes} min
          </p>
        </div>

        <span className="shrink-0 text-sm font-semibold text-yellow-300">
          {formatarData(item)}
        </span>
      </div>

      <div className="mt-2">
        <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-2.5 py-1 text-[10px] font-semibold capitalize text-purple-200">
          {item.status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.status !== "cancelado" && (
          <button
            type="button"
            onClick={() => onAtender(item)}
            className="rounded-lg bg-purple-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-purple-600"
          >
            {futuro ? "Atender" : "Abrir sessão"}
          </button>
        )}

        <button
          type="button"
          onClick={() => onEditar(item)}
          className="rounded-lg border border-purple-500/40 px-3 py-2 text-xs font-semibold text-purple-200 transition hover:bg-white/5"
        >
          Editar
        </button>

        {futuro && item.status !== "cancelado" && (
          <>
            <button
              type="button"
              onClick={() => onRemarcar(item)}
              className="rounded-lg border border-yellow-300/30 px-3 py-2 text-xs font-semibold text-yellow-300 transition hover:bg-yellow-300/10"
            >
              Remarcar
            </button>

            <button
              type="button"
              onClick={() => onCancelar(item)}
              className="rounded-lg border border-orange-300/30 px-3 py-2 text-xs font-semibold text-orange-200 transition hover:bg-orange-300/10"
            >
              Cancelar
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onExcluir(item)}
          className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/10"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

function GrupoAccordion({
  grupo,
  aberto,
  onToggle,
  tipo,
  onEditar,
  onRemarcar,
  onCancelar,
  onExcluir,
  onAtender,
}: {
  grupo: GrupoPaciente;
  aberto: boolean;
  onToggle: () => void;
  tipo: "proximos" | "concluidos";

  onEditar: (item: AgendaAtendimento) => void;
  onRemarcar: (item: AgendaAtendimento) => void;
  onCancelar: (item: AgendaAtendimento) => void;
  onExcluir: (item: AgendaAtendimento) => void;
  onAtender: (item: AgendaAtendimento) => void;
}) {
  const primeiro = grupo.atendimentos[0];

  const textoQuantidade =
    tipo === "proximos"
      ? grupo.atendimentos.length === 1
        ? "1 agendado"
        : `${grupo.atendimentos.length} agendados`
      : grupo.atendimentos.length === 1
        ? "1 concluído"
        : `${grupo.atendimentos.length} concluídos`;

  const textoData =
    tipo === "proximos"
      ? `Próximo: ${formatarData(primeiro)}`
      : `Último: ${formatarData(primeiro)}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-500/30 bg-[#1d0023]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-white/[0.03]"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-white">
              {grupo.nome}
            </span>

            <span className="rounded-full bg-purple-500/15 px-2.5 py-1 text-[10px] font-semibold text-purple-200">
              {textoQuantidade}
            </span>
          </div>

          <p className="mt-1 text-xs text-purple-300/70">
            {textoData}
          </p>
        </div>

        <span className="shrink-0 text-xl text-yellow-300">
          {aberto ? "⌄" : "›"}
        </span>
      </button>

      {aberto && (
        <div className="space-y-3 border-t border-purple-500/20 p-3">
          {grupo.atendimentos.map((item) => (
            <CardAtendimento
              key={item.id}
              item={item}
              futuro={tipo === "proximos"}
              onEditar={onEditar}
              onRemarcar={onRemarcar}
              onCancelar={onCancelar}
              onExcluir={onExcluir}
              onAtender={onAtender}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AgendaListas({
  atendimentos,
  carregando = false,
  onEditar,
  onRemarcar,
  onCancelar,
  onExcluir,
  onAtender,
}: Props) {
  const [abertosProximos, setAbertosProximos] =
    useState<Set<string>>(new Set());

  const [abertosConcluidos, setAbertosConcluidos] =
    useState<Set<string>>(new Set());

  const agora = new Date();

  const proximos = useMemo(() => {
    return [...atendimentos]
      .filter((item) => {
        const status = statusNormalizado(item.status);

        return (
          status !== "cancelado" &&
          !atendimentoConcluido(item) &&
          new Date(item.scheduled_at) >= agora
        );
      })
      .sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime()
      );
  }, [atendimentos]);

  const concluidos = useMemo(() => {
    return [...atendimentos]
      .filter((item) => atendimentoConcluido(item))
      .sort(
        (a, b) =>
          new Date(b.scheduled_at).getTime() -
          new Date(a.scheduled_at).getTime()
      );
  }, [atendimentos]);

  const gruposProximos = useMemo(
    () => agruparPorPaciente(proximos),
    [proximos]
  );

  const gruposConcluidos = useMemo(
    () => agruparPorPaciente(concluidos),
    [concluidos]
  );

  function toggle(
    id: string,
    tipo: "proximos" | "concluidos"
  ) {
    if (tipo === "proximos") {
      setAbertosProximos((anterior) => {
        const novo = new Set(anterior);

        if (novo.has(id)) {
          novo.delete(id);
        } else {
          novo.add(id);
        }

        return novo;
      });

      return;
    }

    setAbertosConcluidos((anterior) => {
      const novo = new Set(anterior);

      if (novo.has(id)) {
        novo.delete(id);
      } else {
        novo.add(id);
      }

      return novo;
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* PRÓXIMOS */}
      <section className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Próximos atendimentos
            </h2>

            <p className="mt-1 text-xs text-purple-300/70">
              Pacientes com sessões agendadas
            </p>
          </div>

          <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-purple-200">
            {gruposProximos.length}{" "}
            {gruposProximos.length === 1
              ? "paciente"
              : "pacientes"}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {carregando ? (
            <p className="text-sm text-purple-300">
              Carregando...
            </p>
          ) : gruposProximos.length > 0 ? (
            gruposProximos.map((grupo) => (
              <GrupoAccordion
                key={grupo.id}
                grupo={grupo}
                aberto={abertosProximos.has(grupo.id)}
                onToggle={() =>
                  toggle(grupo.id, "proximos")
                }
                tipo="proximos"
                onEditar={onEditar}
                onRemarcar={onRemarcar}
                onCancelar={onCancelar}
                onExcluir={onExcluir}
                onAtender={onAtender}
              />
            ))
          ) : (
            <p className="text-sm text-purple-300">
              Nenhum atendimento agendado.
            </p>
          )}
        </div>
      </section>

      {/* CONCLUÍDOS */}
      <section className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Atendimentos concluídos
            </h2>

            <p className="mt-1 text-xs text-purple-300/70">
              Histórico de sessões por paciente
            </p>
          </div>

          <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-purple-200">
            {gruposConcluidos.length}{" "}
            {gruposConcluidos.length === 1
              ? "paciente"
              : "pacientes"}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {carregando ? (
            <p className="text-sm text-purple-300">
              Carregando...
            </p>
          ) : gruposConcluidos.length > 0 ? (
            gruposConcluidos.map((grupo) => (
              <GrupoAccordion
                key={grupo.id}
                grupo={grupo}
                aberto={abertosConcluidos.has(grupo.id)}
                onToggle={() =>
                  toggle(grupo.id, "concluidos")
                }
                tipo="concluidos"
                onEditar={onEditar}
                onRemarcar={onRemarcar}
                onCancelar={onCancelar}
                onExcluir={onExcluir}
                onAtender={onAtender}
              />
            ))
          ) : (
            <p className="text-sm text-purple-300">
              Nenhum atendimento concluído.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}