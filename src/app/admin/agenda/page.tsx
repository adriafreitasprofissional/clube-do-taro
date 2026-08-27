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
          <p className="text-sm font-medium text-fuchsia-400">
            Gestão de atendimentos
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-purple-200">
            Agenda
          </h1>

          <p className="mt-1 text-sm text-purple-300/70">
            Organize seus atendimentos e próximas sessões.
          </p>
        </div>

        <button
          type="button"
          className="
            rounded-xl
            bg-gradient-to-r
            from-purple-800
            to-fuchsia-800
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-lg
            shadow-purple-950/30
            transition
            hover:from-purple-700
            hover:to-fuchsia-700
          "
        >
          + Novo atendimento
        </button>
      </div>

      {/* CARDS SUPERIORES */}
      <div className="grid gap-4 md:grid-cols-4">

        <div className="rounded-2xl border border-purple-300/20 bg-[#f4eff8] p-5 shadow-lg shadow-black/10">
          <p className="text-sm font-medium text-purple-700">
            Hoje
          </p>

          <p className="mt-2 text-2xl font-semibold text-purple-950">
            0
          </p>

          <p className="mt-1 text-xs text-purple-500">
            atendimentos
          </p>
        </div>

        <div className="rounded-2xl border border-purple-300/20 bg-[#f4eff8] p-5 shadow-lg shadow-black/10">
          <p className="text-sm font-medium text-purple-700">
            Esta semana
          </p>

          <p className="mt-2 text-2xl font-semibold text-purple-950">
            0
          </p>

          <p className="mt-1 text-xs text-purple-500">
            atendimentos agendados
          </p>
        </div>

        <div className="rounded-2xl border border-purple-300/20 bg-[#f4eff8] p-5 shadow-lg shadow-black/10">
          <p className="text-sm font-medium text-purple-700">
            Atendimentos ativos
          </p>

          <p className="mt-2 text-2xl font-semibold text-purple-950">
            0
          </p>

          <p className="mt-1 text-xs text-purple-500">
            em acompanhamento
          </p>
        </div>

        <div className="rounded-2xl border border-purple-300/20 bg-[#f4eff8] p-5 shadow-lg shadow-black/10">
          <p className="text-sm font-medium text-purple-700">
            Próximo atendimento
          </p>

          <p className="mt-2 text-lg font-semibold text-purple-950">
            Nenhum
          </p>

          <p className="mt-1 text-xs text-purple-500">
            horário agendado
          </p>
        </div>

      </div>

      {/* CALENDÁRIO */}
      <div className="overflow-hidden rounded-2xl border border-purple-300/20 bg-[#f4eff8] shadow-xl shadow-black/10">

        <div className="flex flex-col gap-4 border-b border-purple-200/60 p-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-purple-950">
              Calendário de atendimentos
            </h2>

            <p className="mt-1 text-sm text-purple-600">
              Visualize sua agenda por mês, semana ou dia.
            </p>
          </div>

          <div className="flex rounded-xl border border-purple-200 bg-[#ebe2f1] p-1">

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
                    ? "bg-purple-800 font-medium text-white shadow-md"
                    : "text-purple-700 hover:bg-purple-100"
                }`}
              >
                {item.label}
              </button>
            ))}

          </div>
        </div>

        <div className="min-h-[420px] p-5">

          <div
            className="
              flex
              min-h-[380px]
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-purple-300
              bg-[#eee7f3]
            "
          >

            <div className="max-w-md px-6 text-center">

              <div className="mb-4 text-4xl">
                📅
              </div>

              <h3 className="text-lg font-semibold text-purple-950">
                Sua agenda começa aqui
              </h3>

              <p className="mt-2 text-sm leading-6 text-purple-600">
                Quando cadastrarmos os primeiros atendimentos, eles aparecerão
                aqui organizados por horário.
              </p>

              <button
                type="button"
                className="
                  mt-5
                  rounded-xl
                  border
                  border-purple-300
                  bg-[#f8f4fa]
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-purple-900
                  shadow-sm
                  transition
                  hover:bg-purple-100
                "
              >
                Cadastrar primeiro atendimento
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* BLOCOS INFERIORES */}
      <div className="grid gap-4 lg:grid-cols-2">

        <div className="rounded-2xl border border-purple-300/20 bg-[#f4eff8] p-5 shadow-lg shadow-black/10">
          <h2 className="text-lg font-semibold text-purple-950">
            Próximos atendimentos
          </h2>

          <p className="mt-1 text-sm text-purple-600">
            Nenhum atendimento agendado.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-300/20 bg-[#f4eff8] p-5 shadow-lg shadow-black/10">
          <h2 className="text-lg font-semibold text-purple-950">
            Atendimentos recentes
          </h2>

          <p className="mt-1 text-sm text-purple-600">
            Nenhum atendimento registrado.
          </p>
        </div>

      </div>
    </div>
  );
}