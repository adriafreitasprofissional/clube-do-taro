export default function AgendaListas() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
        <h2 className="text-lg font-semibold text-white">
          Próximos atendimentos
        </h2>

        <p className="mt-1 text-sm text-purple-300">
          Nenhum atendimento agendado.
        </p>
      </div>

      <div className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
        <h2 className="text-lg font-semibold text-white">
          Atendimentos recentes
        </h2>

        <p className="mt-1 text-sm text-purple-300">
          Nenhum atendimento registrado.
        </p>
      </div>
    </div>
  );
}