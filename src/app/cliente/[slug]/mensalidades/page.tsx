"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Cliente } from "./types/cliente";
import { formatarData } from "./utils/formatarData";
import { formatarMoeda } from "./utils/formatarMoeda";
import MenuDesktop from "./components/MenuDesktop";
import MenuMobile from "./components/MenuMobile";
import AssinaturaCard from "./components/AssinaturaCard";
import PagamentoCard from "./components/PagamentoCard";
import FacilidadesCard from "./components/FacilidadesCard";
import ModalAlterarVencimento from "./components/ModalAlterarVencimento";
import ModalFolego from "./components/ModalFolego";

const pagamentosPorPlano = {
  bronze: { nome: "Plano Bronze" },
  prata: { nome: "Plano Prata" },
  ouro: { nome: "Plano Ouro" },
  diamante: { nome: "Plano Diamante" },
} as const;

export default function MensalidadesPage() {
  const params = useParams();
  const slug = String(params.slug);

  const [cliente, setCliente] = useState<Cliente | null>(null);
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
        Carregando assinatura...
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

        <MenuDesktop slug={slug} />

        <section className="flex-1 px-5 py-8 md:px-10">
{/* MENU MOBILE */}
<MenuMobile slug={slug} />

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
                💳 Minhas Assinaturas
              </h2>
            </div>

            <AssinaturaCard
  pagamentoAtual={pagamentoAtual}
  tipoAssinatura={tipoAssinatura}
  cliente={cliente}
  valorExibido={valorExibido}
  formatarData={formatarData}
  formatarMoeda={formatarMoeda}
/>

            <PagamentoCard
  tipoAssinatura={tipoAssinatura}
  pagamentoAtual={pagamentoAtual}
  valorExibido={valorExibido}
  proximoVencimento={proximoVencimento}
  mostrarPagamento={mostrarPagamento}
  formatarMoeda={formatarMoeda}
  abrirCheckoutMercadoPago={abrirCheckoutMercadoPago}
/>


<FacilidadesCard
  folegoEmAnalise={folegoEmAnalise}
  abrirAlterarVencimento={() => setAlterarVencimentoAberto(true)}
  abrirFolego={() => setFolegoAberto(true)}
/>
<ModalAlterarVencimento
  aberto={alterarVencimentoAberto}
  enviando={enviando}
  novaDataVencimento={novaDataVencimento}
  fechar={() => setAlterarVencimentoAberto(false)}
  salvar={salvarNovoVencimento}
  alterarData={setNovaDataVencimento}
/>
   <ModalFolego
  aberto={folegoAberto}
  enviando={enviando}
  tipoFolego={tipoFolego}
  novaDataFolego={novaDataFolego}
  valorParcial={valorParcial}
  fechar={() => setFolegoAberto(false)}
  alterarTipo={setTipoFolego}
  alterarData={setNovaDataFolego}
  alterarValor={setValorParcial}
  enviar={enviarFolego}
/>             
               </div>
        </section>
      </div>
    
    </main>
  );
}