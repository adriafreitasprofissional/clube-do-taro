"use client";

export type FinanceiroDados = {
  formaCobranca: string;
  valor: string;
};

type Props = {
  dados: FinanceiroDados;
  setDados: (dados: FinanceiroDados) => void;
};

const campo =
  "w-full rounded-xl border border-purple-500/30 bg-[#1d0023] p-4 text-white outline-none focus:border-yellow-300/50";

export default function FinanceiroAtendimento({
  dados,
  setDados,
}: Props) {
  function atualizar(
    campo: keyof FinanceiroDados,
    valor: string
  ) {
    setDados({
      ...dados,
      [campo]: valor,
    });
  }

  const precisaValor =
    dados.formaCobranca === "pacote_pago" ||
    dados.formaCobranca === "pago_antecipado" ||
    dados.formaCobranca === "pagar_no_dia";

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-yellow-300">
          Financeiro do atendimento
        </h3>

        <p className="mt-1 text-sm text-purple-300">
          Informe como este atendimento será tratado financeiramente.
        </p>
      </div>

      <select
        value={dados.formaCobranca}
        onChange={(e) =>
          atualizar("formaCobranca", e.target.value)
        }
        className={campo}
      >
        <option value="incluido_pacote">
          Incluído em pacote
        </option>
        <option value="pacote_pago">
          Pacote pago antecipadamente
        </option>
        <option value="pago_antecipado">
          Atendimento pago antecipadamente
        </option>
        <option value="pagar_no_dia">
          Pagar no dia
        </option>
        <option value="cortesia">Cortesia</option>
        <option value="gratuito">Gratuito</option>
      </select>

      {precisaValor && (
        <div>
          <label className="mb-2 block text-sm text-purple-300">
            Valor
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={dados.valor}
            onChange={(e) =>
              atualizar("valor", e.target.value)
            }
            placeholder="0,00"
            className={campo}
          />
        </div>
      )}

      {dados.formaCobranca === "incluido_pacote" && (
        <div className="rounded-xl border border-yellow-300/30 bg-yellow-300/5 p-4">
          <p className="text-sm font-medium text-yellow-300">
            Esta sessão já está incluída no pacote da cliente.
          </p>
        </div>
      )}

      {dados.formaCobranca === "pacote_pago" && (
        <div className="rounded-xl border border-yellow-300/30 bg-yellow-300/5 p-4">
          <p className="text-sm font-medium text-yellow-300">
            Use esta opção para registrar o valor total do pacote já pago.
          </p>
        </div>
      )}
    </div>
  );
}
