"use client";

import type { NovoCliente } from "./CadastroCliente";
import type { AtendimentoDados } from "./DadosAtendimento";
import type { FinanceiroDados } from "./FinanceiroAtendimento";

type Props = {
  nomeCliente: string;
  novoCliente?: NovoCliente;
  atendimento: AtendimentoDados;
  financeiro: FinanceiroDados;
};

export default function ResumoAtendimento({
  nomeCliente,
  novoCliente,
  atendimento,
  financeiro,
}: Props) {
  const cliente = novoCliente?.nome || nomeCliente || "Não selecionado";

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-yellow-300">
          Resumo do atendimento
        </h3>

        <p className="mt-1 text-sm text-purple-300">
          Confira os dados antes de finalizar.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Item titulo="Cliente" valor={cliente} />

        <Item
          titulo="Atendimento"
          valor={atendimento.tipoAtendimento || "Não informado"}
        />

        <Item
          titulo="Profissional"
          valor={atendimento.profissional || "Não informado"}
        />

        <Item
          titulo="Data"
          valor={atendimento.data || "Não informada"}
        />

        <Item
          titulo="Horário"
          valor={atendimento.horario || "Não informado"}
        />

        <Item
          titulo="Duração"
          valor={`${atendimento.duracao} minutos`}
        />

        <Item
          titulo="Google Meet"
          valor={atendimento.meetUrl ? "Link adicionado" : "Não informado"}
        />

        <Item
          titulo="Cobrança"
          valor={financeiro.formaCobranca.replaceAll("_", " ")}
        />

        <Item
          titulo="Valor"
          valor={
            financeiro.valor
              ? `R$ ${Number(financeiro.valor).toFixed(2).replace(".", ",")}`
              : "R$ 0,00"
          }
        />
      </div>

      {atendimento.observacoes && (
        <div className="rounded-xl border border-purple-500/30 bg-[#1d0023] p-4">
          <p className="text-xs text-purple-300">Observações</p>

          <p className="mt-2 text-sm text-white">
            {atendimento.observacoes}
          </p>
        </div>
      )}
    </div>
  );
}

function Item({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-xl border border-purple-500/30 bg-[#1d0023] p-4">
      <p className="text-xs text-purple-300">{titulo}</p>
      <p className="mt-1 font-medium text-white">{valor}</p>
    </div>
  );
}