"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CopiarPixButton from "@/app/components/CopiarPixButton";

const pagamentosPorPlano = {
  bronze: { nome: "Plano Bronze" },
  prata: { nome: "Plano Prata" },
  ouro: { nome: "Plano Ouro" },
  diamante: { nome: "Plano Diamante" },
} as const;

function formatarData(data?: string | null) {
  if (!data) return "—";
  const texto = String(data).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return "—";
  const [ano, mes, dia] = texto.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor?: number | string | null) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function MensalidadesPage() {
  const params = useParams();
  const slug = String(params.slug);

  const [cliente, setCliente] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  const [alterarVencimentoAberto, setAlterarVencimentoAberto] =
    useState(false);
  const [folegoAberto, setFolegoAberto] = useState(false);

  const [novaDataVencimento, setNovaDataVencimento] = useState("");
  const [tipoFolego, setTipoFolego] = useState<"adiar" | "parcial">("adiar");
  const [novaDataFolego, setNovaDataFolego] = useState("");
  const [valorParcial, setValorParcial] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [folegoEmAnalise, setFolegoEmAnalise] = useState(false);

  useEffect(() => {
    async function buscarCliente() {
      const { data, error } = await supabase
        .from("club_clients")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) console.error("Erro ao buscar assinante:", error);
      if (data) setCliente(data);
      setCarregando(false);
    }

    if (slug) buscarCliente();
  }, [slug]);

  async function salvarNovoVencimento() {
    if (!cliente || !novaDataVencimento) {
      alert("Escolha a nova data de vencimento.");
      return;
    }

    setEnviando(true);

    const novoDia = Number(novaDataVencimento.slice(8, 10));

    const { error } = await supabase
      .from("club_clients")
      .update({
        proximo_vencimento: novaDataVencimento,
        dia_vencimento: novoDia,
      })
      .eq("id", cliente.id);

    setEnviando(false);

    if (error) {
      alert(`Não foi possível alterar o vencimento: ${error.message}`);
      return;
    }

    setCliente({
      ...cliente,
      proximo_vencimento: novaDataVencimento,
      dia_vencimento: novoDia,
    });

    setAlterarVencimentoAberto(false);
    setNovaDataVencimento("");
    alert("Vencimento alterado com sucesso.");
  }

  async function enviarFolego() {
    if (!cliente) return;

    if (tipoFolego === "adiar" && !novaDataFolego) {
      alert("Escolha a nova data desejada.");
      return;
    }

    if (tipoFolego === "parcial" && !valorParcial) {
      alert("Informe o valor que consegue pagar.");
      return;
    }

    setEnviando(true);

    const { error } = await supabase.from("financial_requests").insert({
      client_id: cliente.id,
      request_type:
        tipoFolego === "adiar" ? "adiar_vencimento" : "pagamento_parcial",
      requested_due_date:
        tipoFolego === "adiar" ? novaDataFolego : null,
      partial_amount:
        tipoFolego === "parcial"
          ? Number(valorParcial.replace(",", "."))
          : null,
      message:
        tipoFolego === "adiar"
          ? "Pedido de fôlego para adiar o vencimento."
          : "Pedido de fôlego para realizar pagamento parcial.",
      status: "pending",
    });

    setEnviando(false);

    if (error) {
      alert(`Não foi possível enviar a solicitação: ${error.message}`);
      return;
    }

    setFolegoEmAnalise(true);
    setFolegoAberto(false);
    setNovaDataFolego("");
    setValorParcial("");
    setTipoFolego("adiar");
    alert("Solicitação enviada. Aguarde a análise da administração.");
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#08070f] p-10 text-center text-white">
        Carregando mensalidades...
      </main>
    );
  }

  if (!cliente) {
    return (
      <main className="min-h-screen bg-[#08070f] p-10 text-center text-white">
        Assinante não encontrada.
      </main>
    );
  }

  const planoCliente = String(cliente.plano || "bronze")
    .toLowerCase()
    .trim() as keyof typeof pagamentosPorPlano;

  const pagamentoAtual =
    pagamentosPorPlano[planoCliente] || pagamentosPorPlano.bronze;

  const tipoAssinatura = String(
    cliente.tipo_assinatura || "mensal"
  ).toLowerCase();

  const valorExibido =
    tipoAssinatura === "anual"
      ? cliente.valor_anual
      : tipoAssinatura === "cortesia"
        ? 0
        : cliente.valor_mensal;

  const proximoVencimento =
    tipoAssinatura === "anual"
      ? formatarData(cliente.data_fim_assinatura)
      : tipoAssinatura === "cortesia"
        ? "Cortesia ativa"
        : formatarData(cliente.proximo_vencimento);

  const mostrarPagamento = tipoAssinatura === "mensal";

  async function abrirCheckoutMercadoPago() {
  try {
  const resposta = await fetch(
  "/api/pagamentos/mercadopago/criar-preferencia",
  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plano: planoCliente,
        valor: valorExibido,
      }),
    });

    const dados = await resposta.json();

    if (!dados.initPoint) {
      alert("Não foi possível iniciar o pagamento.");
      return;
    }

    window.location.href = dados.initPoint;
  } catch (error) {
    console.error(error);
    alert("Erro ao conectar com o Mercado Pago.");
  }
}

  return (
    <main className="min-h-screen bg-[#08070f] text-white">
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-72 flex-col border-r border-purple-900/40 bg-[#100d24] p-6 md:flex">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-purple-300">
              Clube do Tarô
            </p>
            <h1 className="mt-2 text-xl font-bold text-yellow-400">
              Área da Assinante
            </h1>
          </div>

          <nav className="flex flex-1 flex-col gap-3">
  <Link
    href={`/cliente/${slug}/mensalidades`}
    className="rounded-xl bg-purple-800 px-4 py-3 text-sm font-bold text-white shadow-lg"
  >
    💳 Minhas Mensalidades
  </Link>
</nav>

          <Link
           href={`/cliente/${slug}/portal`}
            className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-center text-sm font-bold text-yellow-300 transition hover:bg-yellow-500/20"
          >
            ← Voltar ao Portal
          </Link>
        </aside>

        <section className="flex-1 px-5 py-8 md:px-10">
{/* MENU MOBILE */}
<div className="mb-8 grid grid-cols-2 gap-3 md:hidden">

  <Link
    href={`/cliente/${slug}`}
    className="rounded-xl bg-purple-800 p-4 text-center font-bold text-white"
  >
    🔮<br />
    Meu Portal
  </Link>

  <Link
    href={`/cliente/${slug}/portal`}
    className="rounded-xl bg-[#19172f] p-4 text-center font-semibold text-white"
  >
    ✨<br />
    Direcionamentos
  </Link>

  <Link
    href={`https://cursos.magiaoriente.com.br/meus-cursos?slug=${slug}`}
    className="rounded-xl bg-[#19172f] p-4 text-center font-semibold text-white"
  >
    📚<br />
    Meus Cursos
  </Link>

  <Link
    href={`/cliente/${slug}/mensalidades`}
    className="rounded-xl bg-[#19172f] p-4 text-center font-semibold text-white"
  >
    💳<br />
    Mensalidades
  </Link>

  <a
    href={WHATSAPP_CLUBE_VIP}
    target="_blank"
    rel="noreferrer"
    className="rounded-xl bg-[#19172f] p-4 text-center font-semibold text-white"
  >
    💬<br />
    WhatsApp
  </a>

  <a
    href={`${LINK_SORTEIOS}?slug=${slug}`}
    target="_blank"
    rel="noreferrer"
    className="rounded-xl bg-[#19172f] p-4 text-center font-semibold text-white"
  >
    🎲<br />
    Sorteios
  </a>

  <Link
    href="/login"
    className="col-span-2 rounded-xl border border-yellow-500 bg-yellow-500/10 p-4 text-center font-bold text-yellow-300"
  >
    🚪 Sair
  </Link>

</div>

          <div className="mx-auto max-w-2xl">
          
            <Link
             href={`/cliente/${slug}/portal`}
              className="mb-6 inline-flex rounded-xl border border-purple-500/40 bg-[#17142d] px-4 py-3 text-sm font-bold text-purple-200 md:hidden"
            >
              ← Voltar ao Portal
            </Link>

            <div className="mb-7">
              <p className="text-sm text-purple-300">
                Área financeira de {cliente.nome}
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                💳 Minhas Mensalidades
              </h2>
            </div>

            <div className="mb-5 rounded-2xl border border-blue-400/30 bg-[#101827] p-6 shadow-xl">
              <h3 className="text-lg font-bold text-yellow-400">
                💎 {pagamentoAtual.nome}
              </h3>

              <div className="mt-5 grid gap-3 text-sm">
                <p><strong>Tipo:</strong> {tipoAssinatura}</p>
                <p><strong>Status:</strong> {cliente.status || "ativo"}</p>
                <p>
                  <strong>Membro desde:</strong>{" "}
                  {formatarData(cliente.data_inicio)}
                </p>
                <p>
                  <strong>Valor:</strong> {formatarMoeda(valorExibido)}
                </p>
              </div>
            </div>

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
                <p className="text-lg font-bold">{proximoVencimento}</p>
              </div>

              {mostrarPagamento && (
                <>
                  <div className="mt-7 flex flex-col gap-3">
                  <button
  type="button"
  onClick={abrirCheckoutMercadoPago}
  className="rounded-xl bg-red-600 px-5 py-4 text-center text-sm font-extrabold transition hover:bg-red-500"
>
  PAGAR AGORA
</button>

                    <CopiarPixButton chavePix="@adriaescritora@jim.com" />

                    <button
  type="button"
  onClick={abrirCheckoutMercadoPago}
  className="rounded-xl bg-cyan-600 px-5 py-4 text-center text-sm font-extrabold transition hover:bg-cyan-500"
>
  PAGAR COM CARTÃO
</button>

                    <button
                      type="button"
                      onClick={() => setAlterarVencimentoAberto(true)}
                      className="rounded-xl border border-slate-500 bg-slate-700 px-5 py-4 text-sm font-bold transition hover:bg-slate-600"
                    >
                      🗓️ ALTERAR VENCIMENTO
                    </button>

                    <button
                      type="button"
                      onClick={() => setFolegoAberto(true)}
                      disabled={folegoEmAnalise}
                      className="rounded-xl bg-purple-800 px-5 py-4 text-sm font-bold transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {folegoEmAnalise
                        ? "🟣 SOLICITAÇÃO EM ANÁLISE"
                        : "🌙 ME DÁ UM FÔLEGO?"}
                    </button>
                  </div>

                  <p className="mt-6 text-center text-xs leading-relaxed text-purple-300">
                    PIX direto: copie a chave e pague pelo aplicativo do seu banco.
                    Cartão: use o checkout da InfinitePay.
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
          </div>
        </section>
      </div>

      {alterarVencimentoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-purple-500/40 bg-[#17142d] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-purple-300">Área financeira</p>
                <h3 className="mt-1 text-xl font-bold text-yellow-400">
                  🗓️ Alterar vencimento
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setAlterarVencimentoAberto(false)}
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
              onChange={(event) => setNovaDataVencimento(event.target.value)}
              className="mt-2 w-full rounded-xl border border-purple-500/40 bg-[#0d0b1d] px-4 py-3 text-white outline-none focus:border-yellow-400"
            />

            <button
              type="button"
              onClick={salvarNovoVencimento}
              disabled={enviando}
              className="mt-5 w-full rounded-xl bg-yellow-500 px-5 py-4 text-sm font-extrabold text-black transition hover:bg-yellow-400 disabled:opacity-50"
            >
              {enviando ? "SALVANDO..." : "ALTERAR VENCIMENTO"}
            </button>
          </div>
        </div>
      )}

      {folegoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-purple-500/40 bg-[#17142d] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-purple-300">Solicitação financeira</p>
                <h3 className="mt-1 text-xl font-bold text-yellow-400">
                  🌙 Me Dá Um Fôlego?
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setFolegoAberto(false)}
                className="text-xl text-purple-200 hover:text-white"
              >
                ×
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-purple-100">
              Escolha uma opção e envie sua solicitação. A administração analisará.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipoFolego("adiar")}
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
                  Escolha uma nova data para pagar.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTipoFolego("parcial")}
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
                  Informe quanto consegue pagar agora.
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
                  onChange={(event) => setNovaDataFolego(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-purple-500/40 bg-[#0d0b1d] px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>
            ) : (
              <div className="mt-5">
                <label className="block text-sm font-bold text-white">
                  Quanto você consegue pagar agora?
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Ex.: 50,00"
                  value={valorParcial}
                  onChange={(event) => setValorParcial(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-purple-500/40 bg-[#0d0b1d] px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>
            )}

            <button
              type="button"
              onClick={enviarFolego}
              disabled={enviando}
              className="mt-5 w-full rounded-xl bg-yellow-500 px-5 py-4 text-sm font-extrabold text-black transition hover:bg-yellow-400 disabled:opacity-50"
            >
              {enviando ? "ENVIANDO..." : "ENVIAR SOLICITAÇÃO"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}