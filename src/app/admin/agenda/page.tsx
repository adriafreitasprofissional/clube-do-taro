"use client";

import { useState } from "react";

type Visualizacao = "mes" | "semana" | "dia";

export default function AgendaPage() {
  const [visualizacao, setVisualizacao] = useState<Visualizacao>("semana");

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-yellow-300">
            Gestão de atendimentos
          </p>

          <h1 className="mt-1 text-3xl font-semibold text-purple-200">
            Agenda
          </h1>

          <p className="mt-1 text-sm text-purple-300/70">
            Organize seus atendimentos e próximas sessões.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-purple-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-purple-700"
        >
          + Novo atendimento
        </button>
      </div>

      {/* RESUMO */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-purple-500/40 bg-purple-950/90 p-5 shadow-lg shadow-black/20">
          <p className="text-sm text-yellow-300">Hoje</p>

          <p className="mt-2 text-2xl font-semibold text-white">
            0
          </p>

          <p className="mt-1 text-xs text-purple-300">
            atendimentos
          </p>
        </div>

        <div className="rounded-2xl border border-purple-500/40 bg-purple-950/90 p-5 shadow-lg shadow-black/20">
          <p className="text-sm text-yellow-300">
            Esta semana
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            0
          </p>

          <p className="mt-1 text-xs text-purple-300">
            atendimentos agendados
          </p>
        </div>

        <div className="rounded-2xl border border-purple-500/40 bg-purple-950/90 p-5 shadow-lg shadow-black/20">
          <p className="text-sm text-yellow-300">
            Atendimentos ativos
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            0
          </p>

          <p className="mt-1 text-xs text-purple-300">
            em acompanhamento
          </p>
        </div>

        <div className="rounded-2xl border border-purple-500/40 bg-purple-950/90 p-5 shadow-lg shadow-black/20">
          <p className="text-sm text-yellow-300">
            Próximo atendimento
          </p>

          <p className="mt-2 text-lg font-semibold text-white">
            Nenhum
          </p>

          <p className="mt-1 text-xs text-purple-300">
            horário agendado
          </p>
        </div>
      </div>

      {/* CALENDÁRIO */}
      <div className="overflow-hidden rounded-2xl border border-purple-500/40 bg-purple-950/90 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-4 border-b border-purple-500/30 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Calendário de atendimentos
            </h2>

            <p className="mt-1 text-sm text-purple-300">
              Visualize sua agenda por mês, semana ou dia.
            </p>
          </div>

          <div className="flex rounded-xl border border-purple-500/30 bg-black/20 p-1">
            {[
              { id: "mes", label: "Mês" },
              { id: "semana", label: "Semana" },
              { id: "dia", label: "Dia" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setVisualizacao(item.id as Visualizacao)
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

        <div className="min-h-[420px] p-5">
          <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-dashed border-purple-500/40 bg-black/10">
            <div className="max-w-md px-6 text-center">
              <div className="mb-4 text-4xl">
                📅
              </div>

              <h3 className="text-lg font-semibold text-white">
                Sua agenda começa aqui
              </h3>

              <p className="mt-2 text-sm leading-6 text-purple-300">
                Quando cadastrarmos os primeiros atendimentos, eles aparecerão
                aqui organizados por horário.
              </p>

              <button
                type="button"
                className="mt-5 rounded-xl border border-yellow-300/50 bg-transparent px-5 py-2.5 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-300 hover:text-purple-950"
              >
                Cadastrar primeiro atendimento
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCOS INFERIORES */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-purple-500/40 bg-purple-950/90 p-5 shadow-lg shadow-black/20">
          <h2 className="text-lg font-semibold text-white">
            Próximos atendimentos
          </h2>

          <p className="mt-1 text-sm text-purple-300">
            Nenhum atendimento agendado.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-500/40 bg-purple-950/90 p-5 shadow-lg shadow-black/20">
          <h2 className="text-lg font-semibold text-white">
            Atendimentos recentes
          </h2>

          <p className="mt-1 text-sm text-purple-300">
            Nenhum atendimento registrado.
          </p>
        </div>
      </div>
    </div>
  );
}