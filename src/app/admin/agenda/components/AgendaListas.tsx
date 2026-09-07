"use client";

import { useEffect, useMemo, useState } from "react";
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

const POR_PAGINA = 4;

function formatar(item: AgendaAtendimento) {
  const data = new Date(item.scheduled_at);

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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
    <div className="rounded-xl border border-purple-500/30 bg-[#1d0023] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">
            {item.client_name}
          </p>
          <p className="mt-1 text-sm text-purple-300">
            {item.service_type}
          </p>
        </div>

        <span className="shrink-0 text-sm font-semibold text-yellow-300">
          {formatar(item)}
        </span>
      </div>

      <p className="mt-2 text-xs text-purple-300/80">
        {item.professional} ·{" "}
        {item.duration_minutes} min ·{" "}
        <span className="capitalize">
          {item.status}
        </span>
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {futuro && item.status !== "cancelado" && (
          <button
            type="button"
            onClick={() => onAtender(item)}
            className="rounded-lg bg-purple-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-purple-600"
          >
            Atender
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

function Paginacao({
  pagina,
  totalPaginas,
  anterior,
  proximo,
}: {
  pagina: number;
  totalPaginas: number;
  anterior: () => void;
  proximo: () => void;
}) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between border-t border-purple-500/20 pt-4">
      <button
        type="button"
        onClick={anterior}
        disabled={pagina <= 0}
        className="rounded-lg px-3 py-2 text-lg text-purple-200 transition hover:bg-white/5 disabled:opacity-30"
      >
        ‹
      </button>

      <span className="text-xs text-purple-300">
        {pagina + 1} / {totalPaginas}
      </span>

      <button
        type="button"
        onClick={proximo}
        disabled={pagina >= totalPaginas - 1}
        className="rounded-lg px-3 py-2 text-lg text-purple-200 transition hover:bg-white/5 disabled:opacity-30"
      >
        ›
      </button>
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
  const [paginaProximos, setPaginaProximos] =
    useState(0);

  const [paginaRecentes, setPaginaRecentes] =
    useState(0);

  const agora = new Date();

  const proximos = useMemo(
    () =>
      [...atendimentos]
        .filter(
          (item) =>
            item.status !== "cancelado" &&
            new Date(item.scheduled_at) >= agora
        )
        .sort(
          (a, b) =>
            new Date(a.scheduled_at).getTime() -
            new Date(b.scheduled_at).getTime()
        ),
    [atendimentos]
  );

  const recentes = useMemo(
    () =>
      [...atendimentos]
        .filter(
          (item) =>
            new Date(item.scheduled_at) < agora ||
            item.status === "cancelado"
        )
        .sort(
          (a, b) =>
            new Date(b.scheduled_at).getTime() -
            new Date(a.scheduled_at).getTime()
        ),
    [atendimentos]
  );

  const totalProximos = Math.max(
    1,
    Math.ceil(
      proximos.length / POR_PAGINA
    )
  );

  const totalRecentes = Math.max(
    1,
    Math.ceil(
      recentes.length / POR_PAGINA
    )
  );

  useEffect(() => {
    if (paginaProximos >= totalProximos) {
      setPaginaProximos(
        Math.max(0, totalProximos - 1)
      );
    }
  }, [paginaProximos, totalProximos]);

  useEffect(() => {
    if (paginaRecentes >= totalRecentes) {
      setPaginaRecentes(
        Math.max(0, totalRecentes - 1)
      );
    }
  }, [paginaRecentes, totalRecentes]);

  const proximosPagina = proximos.slice(
    paginaProximos * POR_PAGINA,
    paginaProximos * POR_PAGINA +
      POR_PAGINA
  );

  const recentesPagina = recentes.slice(
    paginaRecentes * POR_PAGINA,
    paginaRecentes * POR_PAGINA +
      POR_PAGINA
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
        <h2 className="text-lg font-semibold text-white">
          Próximos atendimentos
        </h2>

        <div className="mt-4 space-y-3">
          {carregando ? (
            <p className="text-sm text-purple-300">
              Carregando...
            </p>
          ) : proximosPagina.length > 0 ? (
            proximosPagina.map((item) => (
              <CardAtendimento
                key={item.id}
                item={item}
                futuro
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

        <Paginacao
          pagina={paginaProximos}
          totalPaginas={
            proximos.length === 0
              ? 1
              : totalProximos
          }
          anterior={() =>
            setPaginaProximos((p) =>
              Math.max(0, p - 1)
            )
          }
          proximo={() =>
            setPaginaProximos((p) =>
              Math.min(
                totalProximos - 1,
                p + 1
              )
            )
          }
        />
      </div>

      <div className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
        <h2 className="text-lg font-semibold text-white">
          Atendimentos recentes
        </h2>

        <div className="mt-4 space-y-3">
          {carregando ? (
            <p className="text-sm text-purple-300">
              Carregando...
            </p>
          ) : recentesPagina.length > 0 ? (
            recentesPagina.map((item) => (
              <CardAtendimento
                key={item.id}
                item={item}
                futuro={false}
                onEditar={onEditar}
                onRemarcar={onRemarcar}
                onCancelar={onCancelar}
                onExcluir={onExcluir}
                onAtender={onAtender}
              />
            ))
          ) : (
            <p className="text-sm text-purple-300">
              Nenhum atendimento registrado.
            </p>
          )}
        </div>

        <Paginacao
          pagina={paginaRecentes}
          totalPaginas={
            recentes.length === 0
              ? 1
              : totalRecentes
          }
          anterior={() =>
            setPaginaRecentes((p) =>
              Math.max(0, p - 1)
            )
          }
          proximo={() =>
            setPaginaRecentes((p) =>
              Math.min(
                totalRecentes - 1,
                p + 1
              )
            )
          }
        />
      </div>
    </div>
  );
}
