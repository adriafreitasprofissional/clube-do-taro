"use client";

import { useEffect, useState } from "react";
import SelecionarCliente from "./SelecionarCliente";
import CadastroCliente, { NovoCliente } from "./CadastroCliente";
import DadosAtendimento, {
  AtendimentoDados,
} from "./DadosAtendimento";
import FinanceiroAtendimento, {
  FinanceiroDados,
} from "./FinanceiroAtendimento";
import ResumoAtendimento from "./ResumoAtendimento";

type Props = {
  aberto: boolean;
  onFechar: () => void;
};

export default function NovoAtendimentoModal({
  aberto,
  onFechar,
}: Props) {
  const [etapa, setEtapa] = useState(1);
  const [tipoCliente, setTipoCliente] =
    useState<"existente" | "novo">("existente");

  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState("");

  const [novoCliente, setNovoCliente] = useState<NovoCliente>({
    nome: "",
    nomeReferencia: "",
    email: "",
    whatsapp: "",
    genero: "Mulher",
  });

  const [atendimento, setAtendimento] =
    useState<AtendimentoDados>({
      tipoAtendimento: "",
      profissional: "",
      data: "",
      horario: "",
      duracao: "60",
      observacoes: "",
    });

  const [financeiro, setFinanceiro] =
    useState<FinanceiroDados>({
      formaCobranca: "incluido_plano",
      valor: "",
    });

  useEffect(() => {
    if (!aberto) return;

    async function carregarClientes() {
      try {
        const response = await fetch("/api/admin/clientes");
        const data = await response.json();

        if (Array.isArray(data)) {
          setClientes(data);
        }
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      }
    }

    carregarClientes();
  }, [aberto]);

  if (!aberto) return null;

  const clienteSelecionado = clientes.find(
    (cliente) => cliente.id === clienteId
  );

  function avancar() {
    if (etapa < 4) {
      setEtapa((atual) => atual + 1);
    }
  }

  function voltar() {
    if (etapa > 1) {
      setEtapa((atual) => atual - 1);
    }
  }

  function finalizar() {
    alert(
      "Fluxo do atendimento concluído. Na próxima etapa vamos salvar no sistema."
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-purple-500/40 bg-[#28002f] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-purple-500/30 bg-[#28002f] p-5">
          <div>
            <p className="text-sm text-yellow-300">
              Novo atendimento
            </p>

            <h2 className="text-xl font-semibold text-white">
              Etapa {etapa} de 4
            </h2>
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg px-3 py-2 text-purple-300 transition hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-5 md:p-6">
          {etapa === 1 && (
            <div className="space-y-6">
              <SelecionarCliente
                tipo={tipoCliente}
                setTipo={setTipoCliente}
                clienteId={clienteId}
                setClienteId={setClienteId}
                clientes={clientes}
              />

              {tipoCliente === "novo" && (
                <CadastroCliente
                  dados={novoCliente}
                  setDados={setNovoCliente}
                />
              )}
            </div>
          )}

          {etapa === 2 && (
            <DadosAtendimento
              dados={atendimento}
              setDados={setAtendimento}
            />
          )}

          {etapa === 3 && (
            <FinanceiroAtendimento
              dados={financeiro}
              setDados={setFinanceiro}
            />
          )}

          {etapa === 4 && (
            <ResumoAtendimento
              nomeCliente={clienteSelecionado?.nome || ""}
              novoCliente={
                tipoCliente === "novo" ? novoCliente : undefined
              }
              atendimento={atendimento}
              financeiro={financeiro}
            />
          )}
        </div>

        <div className="sticky bottom-0 flex items-center justify-between border-t border-purple-500/30 bg-[#28002f] p-5">
          <button
            type="button"
            onClick={etapa === 1 ? onFechar : voltar}
            className="rounded-xl border border-purple-500/40 px-5 py-3 text-sm font-semibold text-purple-200 transition hover:bg-white/5"
          >
            {etapa === 1 ? "Cancelar" : "← Voltar"}
          </button>

          {etapa < 4 ? (
            <button
              type="button"
              onClick={avancar}
              className="rounded-xl bg-purple-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Continuar →
            </button>
          ) : (
            <button
              type="button"
              onClick={finalizar}
              className="rounded-xl bg-yellow-300 px-5 py-3 text-sm font-semibold text-purple-950 transition hover:bg-yellow-200"
            >
              Confirmar atendimento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}