interface Props {
  aberto: boolean;
  enviando: boolean;

  tipoFolego: "adiar" | "parcial";

  novaDataFolego: string;
  valorParcial: string;

  fechar: () => void;

  alterarTipo: (tipo: "adiar" | "parcial") => void;

  alterarData: (valor: string) => void;

  alterarValor: (valor: string) => void;

  enviar: () => void;
}

export default function ModalFolego({
  aberto,
  enviando,
  tipoFolego,
  novaDataFolego,
  valorParcial,
  fechar,
  alterarTipo,
  alterarData,
  alterarValor,
  enviar,
}: Props) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-purple-500/40 bg-[#17142d] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-purple-300">
              Solicitação financeira
            </p>

            <h3 className="mt-1 text-xl font-bold text-yellow-400">
              🌙 Me Dá Um Fôlego?
            </h3>
          </div>

          <button
            type="button"
            onClick={fechar}
            className="text-xl text-purple-200 hover:text-white"
          >
            ×
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-purple-100">
          Escolha uma opção e envie sua solicitação.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => alterarTipo("adiar")}
            className={`rounded-xl border p-4 text-left transition ${
              tipoFolego === "adiar"
                ? "border-yellow-400 bg-yellow-500/10"
                : "border-purple-500/40 bg-[#0d0b1d]"
            }`}
          >
            <span className="block font-bold text-yellow-300">
              🗓️ Adiar vencimento
            </span>

            <span className="mt-1 block text-xs text-purple-200">
              Escolha uma nova data.
            </span>
          </button>

          <button
            type="button"
            onClick={() => alterarTipo("parcial")}
            className={`rounded-xl border p-4 text-left transition ${
              tipoFolego === "parcial"
                ? "border-purple-300 bg-purple-800/30"
                : "border-purple-500/40 bg-[#0d0b1d]"
            }`}
          >
            <span className="block font-bold text-purple-200">
              💜 Pagar uma parte
            </span>

            <span className="mt-1 block text-xs text-purple-200">
              Informe um valor.
            </span>
          </button>
        </div>

        {tipoFolego === "adiar" ? (
          <div className="mt-5">
            <label className="block text-sm font-bold text-white">
              Nova data desejada
            </label>

            <input
              type="date"
              value={novaDataFolego}
              onChange={(e) => alterarData(e.target.value)}
              className="mt-2 w-full rounded-xl border border-purple-500/40 bg-[#0d0b1d] px-4 py-3 text-white outline-none"
            />
          </div>
        ) : (
          <div className="mt-5">
            <label className="block text-sm font-bold text-white">
              Quanto consegue pagar?
            </label>

            <input
              type="number"
              min="1"
              step="0.01"
              value={valorParcial}
              onChange={(e) => alterarValor(e.target.value)}
              className="mt-2 w-full rounded-xl border border-purple-500/40 bg-[#0d0b1d] px-4 py-3 text-white outline-none"
            />
          </div>
        )}

        <button
          type="button"
          onClick={enviar}
          disabled={enviando}
          className="mt-5 w-full rounded-xl bg-yellow-500 px-5 py-4 text-sm font-extrabold text-black transition hover:bg-yellow-400 disabled:opacity-50"
        >
          {enviando ? "ENVIANDO..." : "ENVIAR SOLICITAÇÃO"}
        </button>
      </div>
    </div>
  );
}