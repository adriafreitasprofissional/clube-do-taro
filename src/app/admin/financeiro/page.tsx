"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string;
  nome: string | null;
  slug: string;
  plano: string | null;
  tipo_assinatura: string | null;
  status: string | null;
  genero: string | null;
  metodo_pagamento: string | null;
  dia_vencimento: number | null;
  proximo_vencimento: string | null;
  ultimo_pagamento: string | null;
  status_pagamento: string | null;
  valor_mensal_personalizado: number | null;
  valor_anual_personalizado: number | null;
  valor_mensal: number | null;
  valor_anual: number | null;
  data_inicio: string | null;
  data_fim_assinatura: string | null;
  cortesia_inicio: string | null;
  cortesia_fim: string | null;
};

type SolicitacaoFinanceira = {
  id: string;
  client_id: string;
  request_type:
    | "alterar_vencimento"
    | "adiar_vencimento"
    | "pagamento_parcial";
  requested_due_date: string | null;
  partial_amount: number | null;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  created_at: string;
  club_clients: {
    nome: string | null;
    slug: string;
  } | null;
};
const planos = ["bronze", "prata", "ouro", "diamante", "cortesia"] as const;

const nomesPlanos: Record<(typeof planos)[number], string> = {
  bronze: "🥉 Plano Bronze",
  prata: "🥈 Plano Prata",
  ouro: "🥇 Plano Ouro",
  diamante: "💎 Plano Diamante",
  cortesia: "🎁 Cortesias",
};

const valoresPadrao: Record<string, number> = {
  bronze: 27.2,
  prata: 47,
  ouro: 67,
  diamante: 147,
};

function formatarData(data: string | null) {
  if (!data) return "A definir";

  const partes = data.split("-");
  if (partes.length !== 3) return data;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarValor(valor: number | null) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0);
}

function calcularSituacao(cliente: Cliente) {
  if (cliente.tipo_assinatura === "cortesia") {
    if (!cliente.cortesia_fim) {
      return {
        texto: "Cortesia",
        classe: "bg-purple-500/20 text-purple-200 border-purple-400/40",
      };
    }

    const hoje = new Date();
    const fim = new Date(`${cliente.cortesia_fim}T12:00:00`);
    const dias = Math.ceil(
      (fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dias < 0) {
      return {
        texto: "Cortesia encerrada",
        classe: "bg-red-500/20 text-red-200 border-red-400/40",
      };
    }


    return {
      texto: `Cortesia: ${dias} dia(s)`,
      classe: "bg-purple-500/20 text-purple-200 border-purple-400/40",
    };
  }

  if (cliente.tipo_assinatura === "anual") {
    if (!cliente.data_fim_assinatura) {
      return {
        texto: "Anual válida",
        classe: "bg-cyan-500/20 text-cyan-200 border-cyan-400/40",
      };
    }

    const hoje = new Date();
    const fim = new Date(`${cliente.data_fim_assinatura}T12:00:00`);
    const dias = Math.ceil(
      (fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dias < 0) {
      return {
        texto: "Anual vencida",
        classe: "bg-red-500/20 text-red-200 border-red-400/40",
      };
    }

    return {
      texto: `Anual válida: ${dias} dia(s)`,
      classe: "bg-cyan-500/20 text-cyan-200 border-cyan-400/40",
    };
  }

  if (!cliente.proximo_vencimento) {
    return {
      texto: "Sem vencimento",
      classe: "bg-slate-500/20 text-slate-200 border-slate-400/40",
    };
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const vencimento = new Date(`${cliente.proximo_vencimento}T12:00:00`);
  vencimento.setHours(0, 0, 0, 0);

  const dias = Math.ceil(
    (vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (dias < 0) {
    return {
      texto: `Em atraso: ${Math.abs(dias)} dia(s)`,
      classe: "bg-red-500/20 text-red-200 border-red-400/40",
    };
  }

  if (dias <= 5) {
    return {
      texto: `Vence em ${dias} dia(s)`,
      classe: "bg-yellow-500/20 text-yellow-200 border-yellow-400/40",
    };
  }

  return {
    texto: "Em dia",
    classe: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  };
}

export default function FinanceiroAdminPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoSolicitacoes, setCarregandoSolicitacoes] = useState(true);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoFinanceira[]>([]);
  const [processandoSolicitacao, setProcessandoSolicitacao] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  const [planoEdicao, setPlanoEdicao] = useState("bronze");
  const [tipoEdicao, setTipoEdicao] = useState("mensal");
  const [valorEdicao, setValorEdicao] = useState("");
  const [diaVencimentoEdicao, setDiaVencimentoEdicao] = useState("");
  const [proximoVencimentoEdicao, setProximoVencimentoEdicao] = useState("");
  const [fimAnualEdicao, setFimAnualEdicao] = useState("");
  const [mesesCortesia, setMesesCortesia] = useState("1");
  const [metodoPagamentoEdicao, setMetodoPagamentoEdicao] =
    useState("infinitepay");

  const [planosAbertos, setPlanosAbertos] = useState<Record<string, boolean>>({
    bronze: false,
    prata: false,
    ouro: false,
    diamante: false,
    cortesia: false,
  });

  async function carregarClientes() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("club_clients")
      .select("*")
      .order("nome", { ascending: true });

    if (error) {
      alert(`Erro ao carregar assinantes: ${error.message}`);
      setCarregando(false);
      return;
    }

    setClientes((data || []) as Cliente[]);
    setCarregando(false);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return clientes;

    return clientes.filter((cliente) => {
      return (
        String(cliente.nome || "").toLowerCase().includes(termo) ||
        String(cliente.slug || "").toLowerCase().includes(termo)
      );
    });
  }, [clientes, busca]);

  const resumo = useMemo(() => {
    let emDia = 0;
    let vence = 0;
    let atraso = 0;
    let anual = 0;
    let previsaoMensal = 0;

    clientes.forEach((cliente) => {
      if (
        cliente.tipo_assinatura === "mensal" &&
        cliente.status === "ativo"
      ) {
        const valorMensal =
          cliente.valor_mensal_personalizado ||
          cliente.valor_mensal ||
          valoresPadrao[cliente.plano || "bronze"] ||
          0;

        previsaoMensal += Number(valorMensal);
      }

      if (cliente.tipo_assinatura === "anual") {
        anual += 1;
        return;
      }

      const situacao = calcularSituacao(cliente);

      if (situacao.texto === "Em dia") emDia += 1;
      else if (situacao.texto.includes("Vence em")) vence += 1;
      else if (situacao.texto.includes("atraso")) atraso += 1;
    });

    return { emDia, vence, atraso, anual, previsaoMensal };
  }, [clientes]);

  function abrirEdicao(cliente: Cliente) {
    setClienteEditando(cliente);
    setPlanoEdicao(cliente.plano || "bronze");
    setTipoEdicao(cliente.tipo_assinatura || "mensal");

    const valor =
      cliente.tipo_assinatura === "anual"
        ? cliente.valor_anual_personalizado || cliente.valor_anual
        : cliente.valor_mensal_personalizado ||
          cliente.valor_mensal ||
          valoresPadrao[cliente.plano || "bronze"];

    setValorEdicao(valor ? String(valor).replace(".", ",") : "");
    setDiaVencimentoEdicao(
      cliente.dia_vencimento ? String(cliente.dia_vencimento) : ""
    );
    setProximoVencimentoEdicao(cliente.proximo_vencimento || "");
    setFimAnualEdicao(cliente.data_fim_assinatura || "");
    setMetodoPagamentoEdicao(cliente.metodo_pagamento || "infinitepay");
    setMesesCortesia("1");
  }

async function carregarSolicitacoes() {
  setCarregandoSolicitacoes(true);

  const { data, error } = await supabase
    .from("financial_requests")
    .select(`
      id,
      client_id,
      request_type,
      requested_due_date,
      partial_amount,
      message,
      status,
      admin_note,
      created_at,
      club_clients (
        nome,
        slug
      )
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar solicitações:", error);
    setCarregandoSolicitacoes(false);
    return;
  }

  setSolicitacoes((data || []) as unknown as SolicitacaoFinanceira[]);
  setCarregandoSolicitacoes(false);
}

async function responderSolicitacao(
  solicitacao: SolicitacaoFinanceira,
  resposta: "approved" | "rejected"
) {
  setProcessandoSolicitacao(solicitacao.id);

  const { error: erroSolicitacao } = await supabase
    .from("financial_requests")
    .update({
      status: resposta,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", solicitacao.id);

  if (erroSolicitacao) {
    alert(`Erro ao atualizar solicitação: ${erroSolicitacao.message}`);
    setProcessandoSolicitacao(null);
    return;
  }

  if (
    resposta === "approved" &&
    solicitacao.request_type === "adiar_vencimento" &&
    solicitacao.requested_due_date
  ) {
    const novoDia = Number(solicitacao.requested_due_date.slice(8, 10));

    await supabase
      .from("club_clients")
      .update({
        proximo_vencimento: solicitacao.requested_due_date,
        dia_vencimento: novoDia,
        status_pagamento: "em_dia",
      })
      .eq("id", solicitacao.client_id);
  }

  if (
    resposta === "approved" &&
    solicitacao.request_type === "pagamento_parcial"
  ) {
    await supabase
      .from("club_clients")
      .update({
        status_pagamento: "negociacao",
      })
      .eq("id", solicitacao.client_id);
  }

  setProcessandoSolicitacao(null);
  await carregarSolicitacoes();
  await carregarClientes();
}

async function salvarEdicao() {
  if (!clienteEditando) return;

  if (tipoEdicao === "mensal" && !proximoVencimentoEdicao) {
    alert("Informe o próximo vencimento.");
    return;
  }

  if (tipoEdicao === "anual" && !fimAnualEdicao) {
    alert("Informe a validade da assinatura anual.");
    return;
  }

  const valorInformado = valorEdicao
    ? Number(valorEdicao.replace(",", "."))
    : null;

  if (
    (tipoEdicao === "mensal" || tipoEdicao === "anual") &&
    (valorInformado === null || Number.isNaN(valorInformado))
  ) {
    alert("Informe um valor válido.");
    return;
  }

  setSalvandoEdicao(true);

  const hoje = new Date();
  const hojeTexto = hoje.toISOString().slice(0, 10);
  const meses = Math.max(1, Number(mesesCortesia || 1));

  const fimCortesia = new Date(
    hoje.getFullYear(),
    hoje.getMonth() + meses,
    hoje.getDate()
  )
    .toISOString()
    .slice(0, 10);

  const dadosAtualizados: Record<string, unknown> = {
    plano: planoEdicao,
    tipo_assinatura: tipoEdicao,
    metodo_pagamento: metodoPagamentoEdicao,

    dia_vencimento:
      tipoEdicao === "mensal" && proximoVencimentoEdicao
        ? Number(proximoVencimentoEdicao.slice(8, 10))
        : null,

    proximo_vencimento:
      tipoEdicao === "mensal" ? proximoVencimentoEdicao : null,

    data_fim_assinatura:
      tipoEdicao === "anual" ? fimAnualEdicao : null,

    cortesia_inicio:
      tipoEdicao === "cortesia" ? hojeTexto : null,

    cortesia_fim:
      tipoEdicao === "cortesia" ? fimCortesia : null,

    valor_mensal:
      tipoEdicao === "mensal" ? valorInformado : null,

    valor_anual:
      tipoEdicao === "anual" ? valorInformado : null,

    valor_mensal_personalizado:
      tipoEdicao === "mensal" ? valorInformado : null,

    valor_anual_personalizado:
      tipoEdicao === "anual" ? valorInformado : null,

    status_pagamento:
      tipoEdicao === "cortesia"
        ? "cortesia"
        : tipoEdicao === "anual"
          ? "em_dia"
          : "pendente",
  };

  console.log("DADOS QUE SERÃO SALVOS:", dadosAtualizados);

  const { error } = await supabase
  .from("club_clients")
  .update(dadosAtualizados)
  .eq("id", clienteEditando.id);

  setSalvandoEdicao(false);

  if (error) {
    console.error("ERRO AO SALVAR:", error);
    alert(`Erro ao salvar: ${error.message}`);
    return;
  }

  alert("Condição atualizada com sucesso.");
  setClienteEditando(null);
  await carregarClientes();
}

async function registrarPagamento(cliente: Cliente) {
  if (!confirm(`Confirmar pagamento de ${cliente.nome}?`)) return;

  const hoje = new Date();
  const hojeTexto = hoje.toISOString().slice(0, 10);

  const base = cliente.proximo_vencimento
    ? new Date(`${cliente.proximo_vencimento}T12:00:00`)
    : hoje;

  const proximo = new Date(
    base.getFullYear(),
    base.getMonth() + 1,
    cliente.dia_vencimento || base.getDate()
  );

  const proximoTexto = [
    proximo.getFullYear(),
    String(proximo.getMonth() + 1).padStart(2, "0"),
    String(proximo.getDate()).padStart(2, "0"),
  ].join("-");

  const { error } = await supabase
    .from("club_clients")
    .update({
      ultimo_pagamento: hojeTexto,
      status_pagamento: "em_dia",
      proximo_vencimento:
        cliente.tipo_assinatura === "mensal" ? proximoTexto : cliente.proximo_vencimento,
    })
    .eq("id", cliente.id);

  if (error) {
    alert(`Erro ao registrar pagamento: ${error.message}`);
    return;
  }

  alert(`Pagamento registrado. Próximo vencimento: ${formatarData(proximoTexto)}`);
  await carregarClientes();
}

if (carregando) {
  return (
    <main className="min-h-screen bg-[#08070f] p-10 text-center text-white">
      Carregando financeiro...
    </main>
  );
}

  return (
    
    <main className="min-h-screen bg-[#08070f] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
  
  <button
    type="button"
    onClick={() => window.history.back()}
    className="mb-5 rounded-xl border border-yellow-500/50 px-4 py-2 text-sm font-bold text-yellow-300 transition hover:bg-yellow-500/10"
  >
    ← Voltar à página anterior
  </button>

  <p className="text-sm text-purple-300">
    Administração do Clube do Tarô
  
  </p>

        <h1 className="mt-1 text-3xl font-extrabold text-yellow-400">
          💳 Financeiro das Assinantes
        </h1>

        <p className="mt-2 text-sm text-purple-200">
          Controle de vencimentos, pagamentos, renovações e cortesias.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
            <p className="text-sm text-emerald-200">● Em dia</p>
            <p className="mt-2 text-3xl font-extrabold">{resumo.emDia}</p>
          </div>

          <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-5">
            <p className="text-sm text-yellow-200">● Vencem em até 5 dias</p>
            <p className="mt-2 text-3xl font-extrabold">{resumo.vence}</p>
          </div>

          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5">
            <p className="text-sm text-red-200">● Em atraso</p>
            <p className="mt-2 text-3xl font-extrabold">{resumo.atraso}</p>
          </div>

          <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-5">
            <p className="text-sm text-cyan-200">● Anuais válidas</p>
            <p className="mt-2 text-3xl font-extrabold">{resumo.anual}</p>
          </div>

          <div className="rounded-2xl border border-yellow-400/50 bg-yellow-500/10 p-5">
            <p className="text-sm text-yellow-200">💰 Previsão mensal</p>
            <p className="mt-2 text-3xl font-extrabold text-yellow-400">
              {formatarValor(resumo.previsaoMensal)}
            </p>
            <p className="mt-1 text-xs text-yellow-100/70">
              Mensais ativos · anuais e cortesias excluídos
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <input
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar por nome ou slug..."
            className="w-full rounded-xl border border-purple-500/40 bg-[#19172f] px-4 py-3 text-sm text-white outline-none placeholder:text-purple-300 focus:border-yellow-400"
          />

          <button
            type="button"
            onClick={carregarClientes}
            className="rounded-xl border border-purple-500/50 bg-[#19172f] px-5 py-3 text-sm font-bold text-purple-100 transition hover:bg-purple-800/40"
          >
            ↻ Atualizar lista
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {planos.map((plano) => {
            const clientesDoPlano = clientesFiltrados.filter((cliente) => {
              if (plano === "cortesia") {
                return cliente.tipo_assinatura === "cortesia";
              }

              return (
                cliente.tipo_assinatura !== "cortesia" &&
                String(cliente.plano || "").toLowerCase() === plano
              );
            });

            return (
              <section
                key={plano}
                className="overflow-hidden rounded-2xl border border-purple-500/30 bg-[#121022]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setPlanosAbertos((atual) => ({
                      ...atual,
                      [plano]: !atual[plano],
                    }))
                  }
                  className="flex w-full items-center justify-between bg-[#19172f] px-5 py-4 text-left transition hover:bg-purple-900/30"
                >
                  <div>
                    <p className="font-extrabold text-yellow-400">
                      {nomesPlanos[plano]}
                    </p>
                    <p className="mt-1 text-xs text-purple-300">
                      {clientesDoPlano.length} assinante(s)
                    </p>
                  </div>

                  <span className="text-xl text-purple-200">
                    {planosAbertos[plano] ? "⌃" : "⌄"}
                  </span>
                </button>

                {planosAbertos[plano] && (
                  <div className="overflow-x-auto">
                    {clientesDoPlano.length === 0 ? (
                      <p className="p-6 text-sm text-purple-300">
                        Nenhuma assinante neste grupo.
                      </p>
                    ) : (
                      <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-purple-500/20 text-purple-200">
                          <tr>
                            <th className="px-5 py-4">Assinante</th>
                            <th className="px-5 py-4">Valor</th>
                            <th className="px-5 py-4">Vencimento</th>
                            <th className="px-5 py-4">Situação</th>
                            <th className="px-5 py-4">Ações</th>
                          </tr>
                        </thead>

                        <tbody>
                          {clientesDoPlano.map((cliente) => {
                            const situacao = calcularSituacao(cliente);

                            const valor =
                              cliente.tipo_assinatura === "anual"
                                ? cliente.valor_anual_personalizado ||
                                  cliente.valor_anual ||
                                  valoresPadrao[cliente.plano || "diamante"] *
                                    10
                                : cliente.valor_mensal_personalizado ||
                                  cliente.valor_mensal ||
                                  valoresPadrao[cliente.plano || "bronze"];

                            const vencimento =
                              cliente.tipo_assinatura === "anual"
                                ? cliente.data_fim_assinatura
                                : cliente.tipo_assinatura === "cortesia"
                                  ? cliente.cortesia_fim
                                  : cliente.proximo_vencimento;

                            return (
                              <tr
                                key={cliente.id}
                                className="border-b border-purple-500/10 last:border-0"
                              >
                                <td className="px-5 py-4">
                                  <p className="font-bold text-white">
                                    {cliente.nome || "Sem nome"}
                                  </p>
                                  <p className="mt-1 text-xs text-purple-300">
                                    /{cliente.slug}
                                  </p>
                                </td>

                                <td className="px-5 py-4 font-bold text-yellow-300">
                                  {cliente.tipo_assinatura === "cortesia"
                                    ? "Cortesia"
                                    : formatarValor(valor)}
                                </td>

                                <td className="px-5 py-4 text-purple-100">
                                  {formatarData(vencimento)}
                                </td>

                                <td className="px-5 py-4">
                                  <span
                                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${situacao.classe}`}
                                  >
                                    {situacao.texto}
                                  </span>
                                </td>

                                <td className="px-5 py-4">
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() => registrarPagamento(cliente)}
                                      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold transition hover:bg-emerald-500"
                                    >
                                      ✓ Registrar pagamento
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => abrirEdicao(cliente)}
                                      className="rounded-lg bg-slate-600 px-3 py-2 text-xs font-bold transition hover:bg-slate-500"
                                    >
                                      ✏️ Editar condição
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {clienteEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-purple-500/40 bg-[#19172f] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-purple-300">Condição da assinante</p>
                <h2 className="mt-1 text-xl font-extrabold text-yellow-400">
                  {clienteEditando.nome}
                </h2>
                <p className="mt-1 text-xs text-purple-300">
                  /{clienteEditando.slug}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setClienteEditando(null)}
                className="rounded-lg px-3 py-1 text-xl text-purple-200 hover:bg-purple-800/40"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-purple-100">
                  Plano
                </label>

                <select
                  value={planoEdicao}
                  onChange={(event) => setPlanoEdicao(event.target.value)}
                  className="w-full rounded-xl border border-purple-500/40 bg-[#100d24] px-4 py-3 text-white outline-none"
                >
                  <option value="bronze">Bronze</option>
                  <option value="prata">Prata</option>
                  <option value="ouro">Ouro</option>
                  <option value="diamante">Diamante</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-purple-100">
                  Tipo de assinatura
                </label>

                <select
                  value={tipoEdicao}
                  onChange={(event) => setTipoEdicao(event.target.value)}
                  className="w-full rounded-xl border border-purple-500/40 bg-[#100d24] px-4 py-3 text-white outline-none"
                >
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                  <option value="cortesia">Cortesia</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-purple-100">
                  Valor personalizado
                </label>

                <input
                  value={valorEdicao}
                  onChange={(event) => setValorEdicao(event.target.value)}
                  placeholder="Ex.: 27,20"
                  className="w-full rounded-xl border border-purple-500/40 bg-[#100d24] px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-purple-100">
                  Método de pagamento
                </label>

                <select
                  value={metodoPagamentoEdicao}
                  onChange={(event) =>
                    setMetodoPagamentoEdicao(event.target.value)
                  }
                  className="w-full rounded-xl border border-purple-500/40 bg-[#100d24] px-4 py-3 text-white outline-none"
                >
                  <option value="infinitepay">InfinitePay</option>
                  <option value="pix_direto">PIX direto</option>
                  <option value="kiwify_cartao">Kiwify cartão</option>
                  <option value="cortesia">Cortesia</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </div>

              {tipoEdicao === "mensal" && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-purple-100">
                      Dia de vencimento
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={diaVencimentoEdicao}
                      onChange={(event) =>
                        setDiaVencimentoEdicao(event.target.value)
                      }
                      className="w-full rounded-xl border border-purple-500/40 bg-[#100d24] px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-purple-100">
                      Próximo vencimento
                    </label>

                    <input
                      type="date"
                      value={proximoVencimentoEdicao}
                      onChange={(event) =>
                        setProximoVencimentoEdicao(event.target.value)
                      }
                      className="w-full rounded-xl border border-purple-500/40 bg-[#100d24] px-4 py-3 text-white outline-none"
                    />
                  </div>
                </>
              )}

              {tipoEdicao === "anual" && (
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-purple-100">
                    Validade da assinatura anual
                  </label>

                  <input
                    type="date"
                    value={fimAnualEdicao}
                    onChange={(event) => setFimAnualEdicao(event.target.value)}
                    className="w-full rounded-xl border border-purple-500/40 bg-[#100d24] px-4 py-3 text-white outline-none"
                  />
                </div>
              )}

              {tipoEdicao === "cortesia" && (
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-purple-100">
                    Duração da cortesia
                  </label>

                  <select
                    value={mesesCortesia}
                    onChange={(event) => setMesesCortesia(event.target.value)}
                    className="w-full rounded-xl border border-purple-500/40 bg-[#100d24] px-4 py-3 text-white outline-none"
                  >
                    <option value="1">1 mês</option>
                    <option value="3">3 meses</option>
                    <option value="6">6 meses</option>
                    <option value="12">12 meses</option>
                  </select>
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={salvandoEdicao}
              onClick={salvarEdicao}
              className="mt-6 w-full rounded-xl bg-yellow-500 px-5 py-4 text-sm font-extrabold text-[#1a1026] transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvandoEdicao ? "SALVANDO..." : "SALVAR CONDIÇÃO"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}