"use client";

import { useMemo, useState } from "react";
import type { AgendaAtendimento } from "./agenda-types";

type Visualizacao = "mes" | "semana" | "dia";

type Props = {
  onNovoAtendimento: () => void;
  atendimentos: AgendaAtendimento[];
  carregando?: boolean;
  onEditar: (item: AgendaAtendimento) => void;
};

const DIAS = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
];

function inicioDoDia(data: Date) {
  const resultado = new Date(data);
  resultado.setHours(0, 0, 0, 0);
  return resultado;
}

function fimDoDia(data: Date) {
  const resultado = new Date(data);
  resultado.setHours(23, 59, 59, 999);
  return resultado;
}

function inicioDaSemana(data: Date) {
  const resultado = inicioDoDia(data);
  resultado.setDate(
    resultado.getDate() - resultado.getDay()
  );
  return resultado;
}

function fimDaSemana(data: Date) {
  const resultado = inicioDaSemana(data);
  resultado.setDate(resultado.getDate() + 6);
  resultado.setHours(23, 59, 59, 999);
  return resultado;
}

function mesmoDia(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function duasCasas(numero: number) {
  return String(numero).padStart(2, "0");
}

function hora(item: AgendaAtendimento) {
  const data = new Date(item.scheduled_at);
  return `${duasCasas(
    data.getHours()
  )}:${duasCasas(data.getMinutes())}`;
}

function tituloReferencia(
  referencia: Date,
  visualizacao: Visualizacao
) {
  if (visualizacao === "mes") {
    return referencia.toLocaleDateString(
      "pt-BR",
      {
        month: "long",
        year: "numeric",
      }
    );
  }

  if (visualizacao === "dia") {
    return referencia.toLocaleDateString(
      "pt-BR",
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  }

  const inicio = inicioDaSemana(referencia);
  const fim = fimDaSemana(referencia);

  return `${inicio.toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "short",
    }
  )} — ${fim.toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  )}`;
}

function construirGradeMes(referencia: Date) {
  const primeiro = new Date(
    referencia.getFullYear(),
    referencia.getMonth(),
    1
  );

  const inicio = inicioDaSemana(primeiro);

  return Array.from({ length: 42 }).map(
    (_, indice) => {
      const data = new Date(inicio);
      data.setDate(inicio.getDate() + indice);
      return data;
    }
  );
}

export default function AgendaCalendario({
  onNovoAtendimento,
  atendimentos,
  carregando = false,
  onEditar,
}: Props) {
  const [visualizacao, setVisualizacao] =
    useState<Visualizacao>("semana");

  const [referencia, setReferencia] =
    useState(new Date());

  const validos = useMemo(
    () =>
      atendimentos.filter(
        (item) => item.status !== "cancelado"
      ),
    [atendimentos]
  );

  function navegar(direcao: -1 | 1) {
    const nova = new Date(referencia);

    if (visualizacao === "mes") {
      nova.setMonth(
        nova.getMonth() + direcao
      );
    } else if (visualizacao === "semana") {
      nova.setDate(
        nova.getDate() + 7 * direcao
      );
    } else {
      nova.setDate(
        nova.getDate() + direcao
      );
    }

    setReferencia(nova);
  }

  function eventosDoDia(data: Date) {
    return validos
      .filter((item) =>
        mesmoDia(
          new Date(item.scheduled_at),
          data
        )
      )
      .sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime()
      );
  }

  const gradeMes = construirGradeMes(
    referencia
  );

  const diasSemana = Array.from({
    length: 7,
  }).map((_, indice) => {
    const inicio =
      inicioDaSemana(referencia);
    const data = new Date(inicio);
    data.setDate(
      inicio.getDate() + indice
    );
    return data;
  });

  const eventosDia =
    eventosDoDia(referencia);

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-500/40 bg-[#28002f] shadow-lg shadow-black/20">
      <div className="flex flex-col gap-4 border-b border-purple-500/30 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Calendário de atendimentos
            </h2>
            <p className="mt-1 text-sm text-purple-300">
              Visualize e navegue pela sua agenda.
            </p>
          </div>

          <div className="flex rounded-xl border border-purple-500/30 bg-black/20 p-1">
            {[
              { id: "mes", label: "Mês" },
              {
                id: "semana",
                label: "Semana",
              },
              { id: "dia", label: "Dia" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setVisualizacao(
                    item.id as Visualizacao
                  )
                }
                className={`rounded-lg px-4 py-2 text-sm transition ${
                  visualizacao === item.id
                    ? "bg-purple-700 font-medium text-white shadow"
                    : "text-purple-300 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-purple-500/20 bg-black/10 px-3 py-2">
          <button
            type="button"
            onClick={() => navegar(-1)}
            className="rounded-lg px-3 py-2 text-lg text-purple-200 transition hover:bg-white/5 hover:text-white"
            aria-label="Período anterior"
          >
            ‹
          </button>

          <div className="text-center">
            <p className="capitalize font-semibold text-white">
              {tituloReferencia(
                referencia,
                visualizacao
              )}
            </p>
            <button
              type="button"
              onClick={() =>
                setReferencia(new Date())
              }
              className="mt-1 text-xs font-medium text-yellow-300 hover:text-yellow-200"
            >
              Hoje
            </button>
          </div>

          <button
            type="button"
            onClick={() => navegar(1)}
            className="rounded-lg px-3 py-2 text-lg text-purple-200 transition hover:bg-white/5 hover:text-white"
            aria-label="Próximo período"
          >
            ›
          </button>
        </div>
      </div>

      <div className="p-5">
        {carregando ? (
          <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-purple-500/20 bg-[#1d0023] text-sm text-purple-300">
            Carregando agenda...
          </div>
        ) : visualizacao === "mes" ? (
          <div className="overflow-x-auto">
            <div className="min-w-[780px]">
              <div className="grid grid-cols-7 border-b border-purple-500/30">
                {DIAS.map((dia) => (
                  <div
                    key={dia}
                    className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-yellow-300"
                  >
                    {dia}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 overflow-hidden rounded-b-2xl border-l border-t border-purple-500/20">
                {gradeMes.map((data) => {
                  const eventos =
                    eventosDoDia(data);

                  const noMes =
                    data.getMonth() ===
                    referencia.getMonth();

                  const hoje =
                    mesmoDia(
                      data,
                      new Date()
                    );

                  return (
                    <div
                      key={data.toISOString()}
                      className={`min-h-[120px] border-b border-r border-purple-500/20 p-2 ${
                        noMes
                          ? "bg-[#1d0023]"
                          : "bg-black/15"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                            hoje
                              ? "bg-yellow-300 text-purple-950"
                              : noMes
                              ? "text-white"
                              : "text-purple-400/60"
                          }`}
                        >
                          {data.getDate()}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {eventos
                          .slice(0, 3)
                          .map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() =>
                                onEditar(item)
                              }
                              className="block w-full truncate rounded-md border border-purple-500/30 bg-purple-900/40 px-2 py-1 text-left text-[11px] text-white transition hover:border-yellow-300/50"
                            >
                              <span className="font-semibold text-yellow-300">
                                {hora(item)}
                              </span>{" "}
                              {item.client_name}
                            </button>
                          ))}

                        {eventos.length > 3 && (
                          <p className="px-1 text-[11px] text-purple-300">
                            +{eventos.length - 3} atendimento(s)
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : visualizacao === "semana" ? (
          <div className="overflow-x-auto">
            <div className="grid min-w-[820px] grid-cols-7 gap-2">
              {diasSemana.map((data) => {
                const eventos =
                  eventosDoDia(data);
                const hoje =
                  mesmoDia(
                    data,
                    new Date()
                  );

                return (
                  <div
                    key={data.toISOString()}
                    className="min-h-[360px] rounded-2xl border border-purple-500/25 bg-[#1d0023] p-3"
                  >
                    <div className="border-b border-purple-500/20 pb-3 text-center">
                      <p className="text-xs font-semibold uppercase text-purple-300">
                        {DIAS[data.getDay()]}
                      </p>
                      <div
                        className={`mx-auto mt-2 flex h-9 w-9 items-center justify-center rounded-full font-semibold ${
                          hoje
                            ? "bg-yellow-300 text-purple-950"
                            : "text-white"
                        }`}
                      >
                        {data.getDate()}
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {eventos.length === 0 ? (
                        <p className="py-4 text-center text-xs text-purple-400/60">
                          Livre
                        </p>
                      ) : (
                        eventos.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              onEditar(item)
                            }
                            className="w-full rounded-xl border border-purple-500/30 bg-purple-900/30 p-2 text-left transition hover:border-yellow-300/50"
                          >
                            <p className="text-xs font-bold text-yellow-300">
                              {hora(item)}
                            </p>
                            <p className="mt-1 truncate text-xs font-semibold text-white">
                              {item.client_name}
                            </p>
                            <p className="mt-1 truncate text-[10px] text-purple-300">
                              {item.service_type}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="min-h-[360px] rounded-2xl border border-purple-500/25 bg-[#1d0023] p-4">
            {eventosDia.length === 0 ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-purple-300">
                    Nenhum atendimento neste dia.
                  </p>
                  <button
                    type="button"
                    onClick={onNovoAtendimento}
                    className="mt-4 rounded-xl border border-yellow-300/50 px-4 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-300 hover:text-purple-950"
                  >
                    + Novo atendimento
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {eventosDia.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onEditar(item)
                    }
                    className="grid w-full gap-3 rounded-xl border border-purple-500/30 bg-black/10 p-4 text-left transition hover:border-yellow-300/50 sm:grid-cols-[90px_1fr_auto] sm:items-center"
                  >
                    <p className="text-xl font-bold text-yellow-300">
                      {hora(item)}
                    </p>
                    <div>
                      <p className="font-semibold text-white">
                        {item.client_name}
                      </p>
                      <p className="mt-1 text-sm text-purple-300">
                        {item.service_type} ·{" "}
                        {item.professional}
                      </p>
                    </div>
                    <span className="text-xs text-purple-300">
                      {item.duration_minutes} min
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
