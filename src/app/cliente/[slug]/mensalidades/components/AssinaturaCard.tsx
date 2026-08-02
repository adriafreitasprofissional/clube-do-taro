interface Props {
  pagamentoAtual: {
    nome: string;
  };

  tipoAssinatura: string;

  cliente: {
    status: string;
    data_inicio: string | null;
  };

  valorExibido: number;

  formatarData: (data?: string | null) => string;
  formatarMoeda: (valor?: number | string | null) => string;
}

export default function AssinaturaCard({
  pagamentoAtual,
  tipoAssinatura,
  cliente,
  valorExibido,
  formatarData,
  formatarMoeda,
}: Props) {
  return (
    <div className="mb-5 rounded-2xl border border-blue-400/30 bg-[#101827] p-6 shadow-xl">
      <h3 className="text-lg font-bold text-yellow-400">
        💎 {pagamentoAtual.nome}
      </h3>

      <div className="mt-5 grid gap-3 text-sm">
        <p>
          <strong>Tipo:</strong> {tipoAssinatura}
        </p>

        <p>
          <strong>Status:</strong> {cliente.status || "ativo"}
        </p>

        <p>
          <strong>Membro desde:</strong>{" "}
          {formatarData(cliente.data_inicio)}
        </p>

        <p>
          <strong>Valor:</strong>{" "}
          {formatarMoeda(valorExibido)}
        </p>
      </div>
    </div>
  );
}