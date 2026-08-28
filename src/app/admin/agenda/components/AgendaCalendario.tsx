"use client";

import { useState } from "react";

type Visualizacao = "mes" | "semana" | "dia";

export default function AgendaCalendario() {
  const [visualizacao, setVisualizacao] =
    useState<Visualizacao>("semana");

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-500/40 bg-[#28002f] shadow-lg shadow-black/20">
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
        <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-dashed border-purple-500/40 bg-[#1d0023]">
          <div className="max-w-md px-6 text-center">
            <div className="mb-4 text-4xl">📅</div>

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
  );
}