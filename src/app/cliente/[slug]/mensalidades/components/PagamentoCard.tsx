interface Props {
  tipoAssinatura: string;
  pagamentoAtual: {
    nome: string;
  };
  valorExibido: number;
  proximoVencimento: string;
  mostrarPagamento: boolean;

  formatarMoeda: (valor?: number | string | null) => string;

  abrirCheckoutMercadoPago: () => void;
}

export default function PagamentoCard({
  tipoAssinatura,
  pagamentoAtual,
  valorExibido,
  proximoVencimento,
  mostrarPagamento,
  formatarMoeda,
  abrirCheckoutMercadoPago,
}: Props) {
  return (
    <div className="rounded-2xl border border-purple-500/30 bg-[#19172f] p-6 shadow-xl">
      <p className="text-sm text-purple-200">
        {tipoAssinatura === "cortesia"
          ? "Acesso por cortesia"
          : tipoAssinatura === "anual"
          ? "Assinatura anual"
          : pagamentoAtual.nome}
      </p>

      <h3 className="mt-2 text-3xl font-extrabold text-yellow-400">
        {formatarMoeda(valorExibido)}
      </h3>

      <div className="mt-6">
        <p className="text-sm text-purple-200">
          {tipoAssinatura === "anual"
            ? "Assinatura válida até"
            : tipoAssinatura === "cortesia"
            ? "Situação"
            : "Próximo vencimento"}
        </p>

        <p className="text-lg font-bold">
          {proximoVencimento}
        </p>
      </div>

      {mostrarPagamento && (
        <>
          <div className="mt-7 flex flex-col gap-3">
            <button
              type="button"
              onClick={abrirCheckoutMercadoPago}
              className="rounded-xl bg-red-600 px-5 py-3 text-center text-sm font-bold transition hover:bg-red-500"
            >
              PAGAR AGORA
            </button>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText("11992060403");

                alert(
                  "Chave PIX copiada!\n\nAbra o aplicativo do seu banco e cole a chave para realizar o pagamento."
                );
              }}
              className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold transition hover:bg-blue-500"
            >
              PIX LIVRE
            </button>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-purple-300">
            <strong>Pagar Agora:</strong> Mercado Pago (PIX, cartão e saldo).
            <br />
            <strong>PIX Livre:</strong> pagamento direto para sua chave Nubank.
          </p>
        </>
      )}

      {!mostrarPagamento && (
        <p className="mt-7 rounded-xl border border-purple-500/30 bg-purple-900/20 p-4 text-center text-sm text-purple-100">
          {tipoAssinatura === "cortesia"
            ? "Seu acesso está ativo por cortesia."
            : "Sua assinatura anual está ativa. Não há cobrança mensal."}
        </p>
      )}
    </div>
  );
}