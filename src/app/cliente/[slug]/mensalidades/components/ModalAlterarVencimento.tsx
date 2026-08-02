interface Props {
  aberto: boolean;
  enviando: boolean;
  novaDataVencimento: string;

  fechar: () => void;
  salvar: () => void;
  alterarData: (valor: string) => void;
}

export default function ModalAlterarVencimento({
  aberto,
  enviando,
  novaDataVencimento,
  fechar,
  salvar,
  alterarData,
}: Props) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-purple-500/40 bg-[#17142d] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-purple-300">
              Área financeira
            </p>

            <h3 className="mt-1 text-xl font-bold text-yellow-400">
              🗓️ Alterar vencimento
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
          Escolha sua nova data de vencimento.
        </p>

        <label className="mt-5 block text-sm font-bold text-white">
          Nova data desejada
        </label>

        <input
          type="date"
          value={novaDataVencimento}
          onChange={(e) => alterarData(e.target.value)}
          className="mt-2 w-full rounded-xl border border-purple-500/40 bg-[#0d0b1d] px-4 py-3 text-white outline-none focus:border-yellow-400"
        />

        <button
          type="button"
          onClick={salvar}
          disabled={enviando}
          className="mt-5 w-full rounded-xl bg-yellow-500 px-5 py-4 text-sm font-extrabold text-black transition hover:bg-yellow-400 disabled:opacity-50"
        >
          {enviando ? "SALVANDO..." : "ALTERAR VENCIMENTO"}
        </button>
      </div>
    </div>
  );
}