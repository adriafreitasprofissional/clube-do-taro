interface Props {
  folegoEmAnalise: boolean;

  abrirAlterarVencimento: () => void;
  abrirFolego: () => void;
}

export default function FacilidadesCard({
  folegoEmAnalise,
  abrirAlterarVencimento,
  abrirFolego,
}: Props) {
  return (
    <div className="mt-6 rounded-2xl border border-purple-500/30 bg-[#19172f] p-5 shadow-xl">
      <h3 className="mb-4 text-lg font-bold text-yellow-400">
        Facilidades
      </h3>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={abrirAlterarVencimento}
          className="rounded-xl border border-slate-500 bg-slate-700 px-5 py-3 text-sm font-bold transition hover:bg-slate-600"
        >
          🗓️ Alterar vencimento
        </button>

        <button
          type="button"
          onClick={abrirFolego}
          disabled={folegoEmAnalise}
          className="rounded-xl bg-purple-800 px-5 py-3 text-sm font-bold transition hover:bg-purple-700 disabled:opacity-50"
        >
          {folegoEmAnalise
            ? "Solicitação em análise"
            : "🌙 Me dá um fôlego?"}
        </button>
      </div>
    </div>
  );
}