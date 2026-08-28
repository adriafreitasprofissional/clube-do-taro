"use client";

import { useState } from "react";
import AgendaResumo from "./components/AgendaResumo";
import AgendaCalendario from "./components/AgendaCalendario";
import AgendaListas from "./components/AgendaListas";
import NovoAtendimentoModal from "./components/NovoAtendimentoModal";

export default function AgendaPage() {
  const [novoAtendimentoAberto, setNovoAtendimentoAberto] =
    useState(false);

  return (
    <>
      <div className="space-y-6">
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
            onClick={() => setNovoAtendimentoAberto(true)}
            className="rounded-xl bg-purple-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-purple-700"
          >
            + Novo atendimento
          </button>
        </div>

        <AgendaResumo />

        <AgendaCalendario />

        <AgendaListas />
      </div>

      <NovoAtendimentoModal
        aberto={novoAtendimentoAberto}
        onFechar={() => setNovoAtendimentoAberto(false)}
      />
    </>
  );
}