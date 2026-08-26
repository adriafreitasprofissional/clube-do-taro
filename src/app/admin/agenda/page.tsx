"use client";

import { useState } from "react";

type Visualizacao = "mes" | "semana" | "dia";

export default function AgendaPage() {
  const [visualizacao, setVisualizacao] = useState<Visualizacao>("semana");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-purple-500">Gestão de atendimentos</p>

          <h1 className="text-3xl font-semibold text-purple-950">
            Agenda
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Organize seus atendimentos e próximas sessões.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-purple-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-purple-800"
        >
          + Novo atendimento
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Hoje</p>
          <p className="mt-2 text-2xl font-semibold text-purple-950">0</p>
          <p className="mt-1 text-xs text-gray-400">atendimentos</p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Esta semana</p>
          <p className="mt-2 text-2xl font-semibold text-purple-950">0</p>
          <p className="mt-1 text-xs text-gray-400">atendimentos agendados</p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Atendimentos ativos</p>
          <p className="mt-2 text-2xl font-semibold text-purple-950">0</p>
          <p className="mt-1 text-xs text-gray-400">em acompanhamento</p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Próximo atendimento</p>
          <p className="mt-2 text-lg font-semibold text-purple-950">
            Nenhum
          </p>
          <p className="mt-1 text-xs text-gray-400">horário agendado</p>
        </div>
      </div>

      <div className="rounded-2xl border border-purple-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-purple-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-purple-950">
              Calendário de atendimentos
            </h2>

            <p className="text-sm text-gray-500">
              Visualize sua agenda por mês, semana ou dia.
            </p>
          </div>

          <div className="flex rounded-xl bg-purple-50 p-1">
            {[
              { id: "mes", label: "Mês" },
              { id: "semana", label: "Semana" },
              { id: "dia", label: "Dia" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setVisualizacao(item.id as Visualizacao)}
                className={`rounded-lg px-4 py-2 text-sm transition ${
                  visualizacao === item.id
                    ? "bg-white font-medium text-purple-900 shadow-sm"
                    : "text-purple-600 hover:text-purple-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[420px] p-5">
          <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-dashed border-purple-200 bg-purple-50/40">
            <div className="max-w-md px-6 text-center">
              <div className="mb-4 text-4xl">📅</div>

              <h3 className="text-lg font-semibold text-purple-950">
                Sua agenda começa aqui
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Quando cadastrarmos os primeiros atendimentos, eles aparecerão
                aqui organizados por horário.
              </p>

              <button
                type="button"
                className="mt-5 rounded-xl border border-purple-200 bg-white px-5 py-2.5 text-sm font-medium text-purple-900 shadow-sm transition hover:bg-purple-50"
              >
                Cadastrar primeiro atendimento
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-purple-950">
            Próximos atendimentos
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Nenhum atendimento agendado.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-purple-950">
            Atendimentos recentes
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Nenhum atendimento registrado.
          </p>
        </div>
      </div>
    </div>
  );
}