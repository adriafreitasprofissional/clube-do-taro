export default function AgendaResumo() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
        <p className="text-sm text-yellow-300">Hoje</p>

        <p className="mt-2 text-2xl font-semibold text-white">
          0
        </p>

        <p className="mt-1 text-xs text-purple-300">
          atendimentos
        </p>
      </div>

      <div className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
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

      <div className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
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

      <div className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
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
  );
}