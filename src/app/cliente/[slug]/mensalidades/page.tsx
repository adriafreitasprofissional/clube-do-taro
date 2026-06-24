"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CopiarPixButton from "@/components/CopiarPixButton";

export default function MensalidadesPage() {
  const params = useParams();
  const slug = String(params.slug);

  const [cliente, setCliente] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

const [folegoAberto, setFolegoAberto] = useState(false);
const [tipoFolego, setTipoFolego] = useState<"adiar" | "parcial">("adiar");
const [novaData, setNovaData] = useState("");
const [valorParcial, setValorParcial] = useState("");
const [enviandoFolego, setEnviandoFolego] = useState(false);


  useEffect(() => {
    async function buscarCliente() {
      const { data, error } = await supabase
        .from("club_clients")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        setCliente(data);
      }

      setCarregando(false);
    }

    if (slug) {
      buscarCliente();
    }
  }, [slug]);

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

  const pagamentosPorPlano = {
    bronze: {
      nome: "Plano Bronze",
      valorFormatado: "R$ 27,20",
      linkPagamento:
        "https://invoice.infinitepay.io/plans/adriaescritora/fC6YXan9aP",
    },
    prata: {
      nome: "Plano Prata",
      valorFormatado: "R$ 47,00",
      linkPagamento:
        "https://app.infinitepay.io/plans/share/fpn2fMg9Qd",
    },
    ouro: {
      nome: "Plano Ouro",
      valorFormatado: "R$ 67,00",
      linkPagamento:
        "https://invoice.infinitepay.io/plans/adriaescritora/fvbXy2rRsn",
    },
    diamante: {
      nome: "Plano Diamante",
      valorFormatado: "R$ 147,00",
      linkPagamento:
        "https://invoice.infinitepay.io/plans/adriaescritora/UM4UHqFNPD",
    },
  } as const;

  const planoCliente = String(cliente.plano || "bronze")
    .toLowerCase()
    .trim() as keyof typeof pagamentosPorPlano;

  const pagamentoAtual =
    pagamentosPorPlano[planoCliente] || pagamentosPorPlano.bronze;

  const proximoVencimento = cliente.proximo_vencimento
    ? new Date(`${cliente.proximo_vencimento}T12:00:00`).toLocaleDateString(
        "pt-BR"
      )
    : cliente.dia_vencimento
      ? `Todo dia ${cliente.dia_vencimento}`
      : "A definir";

  const membroDesde = cliente.data_inicio
    ? new Date(`${cliente.data_inicio}T12:00:00`).toLocaleDateString("pt-BR")
    : "—";

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
              href={`/cliente/${slug}`}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800/40"
            >
              🔮 Meu Portal
            </Link>

            <Link
              href={`/cliente/${slug}/mensalidades`}
              className="rounded-xl bg-purple-800 px-4 py-3 text-sm font-bold text-white shadow-lg"
            >
              💳 Minhas Mensalidades
            </Link>

            <Link
              
              href={`/cliente/${slug}/energia`}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800/40"
            >
              ✨ Meus Direcionamentos
            </Link>

            <Link
             
  href={`/cliente/${slug}/perguntas-exclusivas`}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800/40"
            >
              📩 Minhas Perguntas
            </Link>
          </nav>

          <Link
            href={`/cliente/${slug}`}
            className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-center text-sm font-bold text-yellow-300 transition hover:bg-yellow-500/20"
          >
            ← Voltar ao Portal
          </Link>
        </aside>

        <section className="flex-1 px-5 py-8 md:px-10">
          <div className="mx-auto max-w-2xl">
            <Link
              href={`/cliente/${slug}`}
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
                <p>
                  <strong>Tipo:</strong> {cliente.tipo_assinatura || "mensal"}
                </p>
                <p>
                  <strong>Status:</strong> {cliente.status || "ativo"}
                </p>
                <p>
                  <strong>Membro desde:</strong> {membroDesde}
                </p>
                <p>
                  <strong>Valor:</strong> {pagamentoAtual.valorFormatado}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-500/30 bg-[#19172f] p-6 shadow-xl">
              <p className="text-sm text-purple-200">
                {pagamentoAtual.nome}
              </p>

              <h3 className="mt-2 text-3xl font-extrabold text-yellow-400">
                {pagamentoAtual.valorFormatado}
              </h3>

              <div className="mt-6">
                <p className="text-sm text-purple-200">Próximo vencimento</p>
                <p className="text-lg font-bold">{proximoVencimento}</p>
              </div>

              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={pagamentoAtual.linkPagamento}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-red-600 px-5 py-4 text-center text-sm font-extrabold transition hover:bg-red-500"
                >
                  PAGAR AGORA
                </a>

                <CopiarPixButton chavePix="@adriaescritora@jim.com" />

                <a
                  href={pagamentoAtual.linkPagamento}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-cyan-600 px-5 py-4 text-center text-sm font-extrabold transition hover:bg-cyan-500"
                >
                  PAGAR COM CARTÃO
                </a>

                <button
                  type="button"
                  className="rounded-xl border border-slate-500 bg-slate-700 px-5 py-4 text-sm font-bold transition hover:bg-slate-600"
                >
                  🗓️ ALTERAR VENCIMENTO
                </button>

                       <button
                  type="button"
                  onClick={() => setFolegoAberto(true)}
                  className="rounded-xl bg-purple-800 px-5 py-4 text-sm font-bold transition hover:bg-purple-700"
                >
                  🌙 ME DÁ UM FÔLEGO?
                </button>

                <p className="mt-6 text-center text-xs leading-relaxed text-purple-300">
                  PIX direto: copie a chave e pague pelo aplicativo do seu banco.
                  Cartão: use o checkout da InfinitePay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {folegoAberto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-purple-500/40 bg-[#19172f] p-6 shadow-2xl">
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
                  onClick={() => setFolegoAberto(false)}
                  className="rounded-lg px-3 py-1 text-xl text-purple-200 hover:bg-purple-800/40"
                  aria-label="Fechar"
                >
                  ×
                </button>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-purple-100">
                Se este mês ficou apertado, escolha uma opção e envie sua
                solicitação. O Clube analisará e retornará pelo canal de
                atendimento.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setTipoFolego("adiar")}
                  className={`rounded-xl border px-4 py-4 text-left transition ${
                    tipoFolego === "adiar"
                      ? "border-yellow-400 bg-yellow-500/10 text-yellow-300"
                      : "border-purple-500/30 bg-[#100d24] text-white hover:bg-purple-800/30"
                  }`}
                >
                  <strong className="block">🗓️ Adiar vencimento</strong>
                  <span className="mt-1 block text-xs opacity-80">
                    Escolha uma nova data para pagar.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipoFolego("parcial")}
                  className={`rounded-xl border px-4 py-4 text-left transition ${
                    tipoFolego === "parcial"
                      ? "border-yellow-400 bg-yellow-500/10 text-yellow-300"
                      : "border-purple-500/30 bg-[#100d24] text-white hover:bg-purple-800/30"
                  }`}
                >
                  <strong className="block">💜 Pagar uma parte</strong>
                  <span className="mt-1 block text-xs opacity-80">
                    Informe quanto consegue pagar agora.
                  </span>
                </button>
              </div>

              {tipoFolego === "adiar" ? (
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-purple-100">
                    Nova data desejada
                  </label>

                  <input
                    type="date"
                    value={novaData}
                    onChange={(event) => setNovaData(event.target.value)}
                    className="w-full rounded-xl border border-purple-500/40 bg-[#100d24] px-4 py-3 text-white outline-none focus:border-yellow-400"
                  />
                </div>
              ) : (
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-purple-100">
                    Quanto você consegue pagar agora?
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={valorParcial}
                    onChange={(event) => setValorParcial(event.target.value)}
                    placeholder="Ex.: 15,00"
                    className="w-full rounded-xl border border-purple-500/40 bg-[#100d24] px-4 py-3 text-white outline-none focus:border-yellow-400"
                  />
                </div>
              )}

              <button
                type="button"
                disabled={enviandoFolego}
                onClick={async () => {
                  if (tipoFolego === "adiar" && !novaData) {
                    alert("Escolha a nova data desejada.");
                    return;
                  }

                  if (tipoFolego === "parcial" && !valorParcial) {
                    alert("Informe o valor que consegue pagar.");
                    return;
                  }

                  setEnviandoFolego(true);

                  const { error } = await supabase
                    .from("solicitacoes_financeiras")
                    .insert({
                      cliente_id: cliente.id,
                      slug_cliente: slug,
                      nome_cliente: cliente.nome,
                      tipo: tipoFolego,
                      nova_data: tipoFolego === "adiar" ? novaData : null,
                      valor_parcial:
                        tipoFolego === "parcial"
                          ? Number(valorParcial.replace(",", "."))
                          : null,
                      status: "pendente",
                    });

                  setEnviandoFolego(false);

                  if (error) {
                    alert(
                      "Ainda falta criar a tabela de solicitações financeiras."
                    );
                    return;
                  }

                  alert(
                    "Solicitação enviada com sucesso. Em breve você receberá um retorno."
                  );

                  setFolegoAberto(false);
                  setNovaData("");
                  setValorParcial("");
                  setTipoFolego("adiar");
                }}
                className="mt-6 w-full rounded-xl bg-yellow-500 px-5 py-4 text-sm font-extrabold text-[#1a1026] transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviandoFolego ? "ENVIANDO..." : "ENVIAR SOLICITAÇÃO"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}