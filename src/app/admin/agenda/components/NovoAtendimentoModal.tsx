"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import SelecionarCliente from "./SelecionarCliente";
import CadastroCliente, {
  NovoCliente,
} from "./CadastroCliente";
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
  onSalvo?: () => void | Promise<void>;
};

function estadoAtendimentoInicial(): AtendimentoDados {
  return {
    tipoAtendimento: "Terapia TRG",
    profissional: "Ádria Freitas",
    data: "",
    horario: "",
    duracao: "60",
    observacoes: "",
    meetUrl: "",
  };
}

function estadoFinanceiroInicial(): FinanceiroDados {
  return {
    formaCobranca: "incluido_pacote",
    valor: "",
  };
}

export default function NovoAtendimentoModal({
  aberto,
  onFechar,
  onSalvo,
}: Props) {
  const [etapa, setEtapa] = useState(1);
  const [tipoCliente, setTipoCliente] =
    useState<"existente" | "novo">("existente");

  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState("");

  const [novoCliente, setNovoCliente] =
    useState<NovoCliente>({
      nome: "",
      nomeReferencia: "",
      email: "",
      whatsapp: "",
      genero: "Mulher",
    });

  const [atendimento, setAtendimento] =
    useState<AtendimentoDados>(
      estadoAtendimentoInicial()
    );

  const [financeiro, setFinanceiro] =
    useState<FinanceiroDados>(
      estadoFinanceiroInicial()
    );

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!aberto) return;

    async function carregarClientes() {
      try {
        const response = await fetch("/api/admin/clientes", {
          cache: "no-store",
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setClientes(data);
          return;
        }

        if (Array.isArray(data?.clientes)) {
          setClientes(data.clientes);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar clientes:",
          error
        );
      }
    }

    carregarClientes();
  }, [aberto]);

  if (!aberto) return null;

  const clienteSelecionado = clientes.find(
    (cliente) => cliente.id === clienteId
  );

  function nomeDoCliente(cliente: any) {
    return (
      cliente?.nome_referencia ||
      cliente?.nomeReferencia ||
      cliente?.nome ||
      ""
    );
  }

  function avancar() {
    setErro(null);

    if (etapa === 1) {
      if (tipoCliente === "existente" && !clienteId) {
        setErro("Selecione uma cliente para continuar.");
        return;
      }

      if (tipoCliente === "novo") {
        setErro(
          "O cadastro de novas clientes será conectado na próxima etapa. Para a Maria, use Cliente existente."
        );
        return;
      }
    }

    if (etapa === 2) {
      if (
        !atendimento.tipoAtendimento ||
        !atendimento.profissional ||
        !atendimento.data ||
        !atendimento.horario
      ) {
        setErro(
          "Informe atendimento, profissional, data e horário."
        );
        return;
      }
    }

    if (etapa < 4) {
      setEtapa((atual) => atual + 1);
    }
  }

  function voltar() {
    setErro(null);

    if (etapa > 1) {
      setEtapa((atual) => atual - 1);
    }
  }

  function limparEFechar() {
    setEtapa(1);
    setTipoCliente("existente");
    setClienteId("");
    setNovoCliente({
      nome: "",
      nomeReferencia: "",
      email: "",
      whatsapp: "",
      genero: "Mulher",
    });
    setAtendimento(estadoAtendimentoInicial());
    setFinanceiro(estadoFinanceiroInicial());
    setErro(null);
    onFechar();
  }

  async function finalizar() {
    if (!clienteId) {
      setErro("Selecione uma cliente.");
      return;
    }

    setSalvando(true);
    setErro(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "Sessão administrativa expirada. Entre novamente."
        );
      }

      const response = await fetch("/api/admin/agenda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          client_id: clienteId,
          service_type: atendimento.tipoAtendimento,
          professional: atendimento.profissional,
          date: atendimento.data,
          time: atendimento.horario,
          duration_minutes: Number(
            atendimento.duracao
          ),
          notes: atendimento.observacoes,
          meet_url: atendimento.meetUrl,
          charge_type: financeiro.formaCobranca,
          amount: financeiro.valor
            ? Number(financeiro.valor)
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível salvar o atendimento."
        );
      }

      await onSalvo?.();
      limparEFechar();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o atendimento."
      );
    } finally {
      setSalvando(false);
    }
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
            onClick={limparEFechar}
            className="rounded-lg px-3 py-2 text-purple-300 transition hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-5 md:p-6">
          {erro && (
            <div className="mb-5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {erro}
            </div>
          )}

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
              nomeCliente={
                nomeDoCliente(clienteSelecionado) || ""
              }
              novoCliente={
                tipoCliente === "novo"
                  ? novoCliente
                  : undefined
              }
              atendimento={atendimento}
              financeiro={financeiro}
            />
          )}
        </div>

        <div className="sticky bottom-0 flex items-center justify-between border-t border-purple-500/30 bg-[#28002f] p-5">
          <button
            type="button"
            onClick={
              etapa === 1 ? limparEFechar : voltar
            }
            disabled={salvando}
            className="rounded-xl border border-purple-500/40 px-5 py-3 text-sm font-semibold text-purple-200 transition hover:bg-white/5 disabled:opacity-50"
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
              disabled={salvando}
              className="rounded-xl bg-yellow-300 px-5 py-3 text-sm font-semibold text-purple-950 transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando
                ? "Salvando..."
                : "Confirmar atendimento"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
