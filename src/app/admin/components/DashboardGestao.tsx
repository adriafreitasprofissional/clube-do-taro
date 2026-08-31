"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string;
  nome: string | null;
  plano: string | null;
  tipo_assinatura: string | null;
  status: string | null;
  proximo_vencimento: string | null;
  valor_mensal_personalizado: number | null;
  valor_mensal: number | null;
};

const valoresPadrao: Record<string, number> = {
  bronze: 27.2,
  prata: 47,
  ouro: 67,
  diamante: 147,
};

function formatarValor(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function obterValorMensal(cliente: Cliente) {
  return Number(
    cliente.valor_mensal_personalizado ||
      cliente.valor_mensal ||
      valoresPadrao[(cliente.plano || "").toLowerCase()] ||
      0
  );
}

export default function DashboardGestao() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("club_clients")
      .select(`
        id,
        nome,
        plano,
        tipo_assinatura,
        status,
        proximo_vencimento,
        valor_mensal_personalizado,
        valor_mensal
      `);

    if (error) {
      console.error("Erro ao carregar dashboard:", error);
      setClientes([]);
      setCarregando(false);
      return;
    }

    setClientes((data || []) as Cliente[]);
    setCarregando(false);
  }

  const metricas = useMemo(() => {
    const ativos = clientes.filter(
      (cliente) =>
        (cliente.status || "").toLowerCase().trim() === "ativo"
    );

    const mensais = ativos.filter(
      (cliente) => cliente.tipo_assinatura === "mensal"
    );

    const anuais = ativos.filter(
      (cliente) => cliente.tipo_assinatura === "anual"
    );

    const cortesias = ativos.filter(
      (cliente) => cliente.tipo_assinatura === "cortesia"
    );

    let previsaoMensal = 0;
    let emDia = 0;
    let vencemEmBreve = 0;
    let atraso = 0;

    const porPlano = {
      bronze: 0,
      prata: 0,
      ouro: 0,
      diamante: 0,
    };

    mensais.forEach((cliente) => {
      previsaoMensal += obterValorMensal(cliente);

      const plano = (cliente.plano || "").toLowerCase();

      if (plano in porPlano) {
        porPlano[plano as keyof typeof porPlano] += 1;
      }

      if (!cliente.proximo_vencimento) {
        return;
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const vencimento = new Date(
        `${cliente.proximo_vencimento}T12:00:00`
      );
      vencimento.setHours(0, 0, 0, 0);

      const dias = Math.ceil(
        (vencimento.getTime() - hoje.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (dias < 0) {
        atraso += 1;
      } else if (dias <= 5) {
        vencemEmBreve += 1;
      } else {
        emDia += 1;
      }
    });

    const ticketMedio =
      mensais.length > 0
        ? previsaoMensal / mensais.length
        : 0;

    const totalPlanos =
      porPlano.bronze +
      porPlano.prata +
      porPlano.ouro +
      porPlano.diamante;

    return {
      ativos: ativos.length,
      mensais: mensais.length,
      anuais: anuais.length,
      cortesias: cortesias.length,
      previsaoMensal,
      emDia,
      vencemEmBreve,
      atraso,
      ticketMedio,
      porPlano,
      totalPlanos,
    };
  }, [clientes]);

  function percentualPlano(valor: number) {
    if (metricas.totalPlanos === 0) return 0;

    return Math.round(
      (valor / metricas.totalPlanos) * 100
    );
  }

  const barrasPlano = [
    {
      nome: "Bronze",
      valor: metricas.porPlano.bronze,
      percentual: percentualPlano(
        metricas.porPlano.bronze
      ),
    },
    {
      nome: "Prata",
      valor: metricas.porPlano.prata,
      percentual: percentualPlano(
        metricas.porPlano.prata
      ),
    },
    {
      nome: "Ouro",
      valor: metricas.porPlano.ouro,
      percentual: percentualPlano(
        metricas.porPlano.ouro
      ),
    },
    {
      nome: "Diamante",
      valor: metricas.porPlano.diamante,
      percentual: percentualPlano(
        metricas.porPlano.diamante
      ),
    },
  ];

  if (carregando) {
    return (
      <div className="mt-8 text-white/60">
        Carregando métricas...
      </div>
    );
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-[#28002f] p-5">
          <p className="text-sm uppercase tracking-wider text-white/45">
            Ativos
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            {metricas.ativos}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#28002f] p-5">
          <p className="text-sm uppercase tracking-wider text-white/45">
            Previsão mensal
          </p>
          <p className="mt-2 text-3xl font-bold text-[#E7C96F]">
            {formatarValor(metricas.previsaoMensal)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#28002f] p-5">
          <p className="text-sm uppercase tracking-wider text-white/45">
            Ticket médio
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            {formatarValor(metricas.ticketMedio)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#28002f] p-5">
          <p className="text-sm uppercase tracking-wider text-white/45">
            Em atraso
          </p>
          <p className="mt-2 text-3xl font-bold text-red-300">
            {metricas.atraso}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#28002f] p-5">
          <p className="text-sm uppercase tracking-wider text-white/45">
            Vencem em 5 dias
          </p>
          <p className="mt-2 text-3xl font-bold text-yellow-300">
            {metricas.vencemEmBreve}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#28002f] p-6">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#E7C96F]">
              Base de clientes
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">
              Assinantes por plano
            </h3>
          </div>

          <div className="space-y-5">
            {barrasPlano.map((item) => (
              <div key={item.nome}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    {item.nome}
                  </span>

                  <span className="text-sm text-white/55">
                    {item.valor} · {item.percentual}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6f3b8f] via-[#9d6ab8] to-[#E7C96F] transition-all"
                    style={{
                      width: `${item.percentual}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#28002f] p-6">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#E7C96F]">
              Saúde financeira
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">
              Situação das mensalidades
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#1d0023] p-5 text-center">
              <p className="text-3xl font-bold text-green-300">
                {metricas.emDia}
              </p>
              <p className="mt-2 text-sm text-white/50">
                Em dia
              </p>
            </div>

            <div className="rounded-2xl bg-[#1d0023] p-5 text-center">
              <p className="text-3xl font-bold text-yellow-300">
                {metricas.vencemEmBreve}
              </p>
              <p className="mt-2 text-sm text-white/50">
                Vencem em breve
              </p>
            </div>

            <div className="rounded-2xl bg-[#1d0023] p-5 text-center">
              <p className="text-3xl font-bold text-red-300">
                {metricas.atraso}
              </p>
              <p className="mt-2 text-sm text-white/50">
                Em atraso
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-[#1d0023] p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm text-white/55">
                Mensais
              </span>
              <span className="font-bold text-white">
                {metricas.mensais}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 py-3">
              <span className="text-sm text-white/55">
                Anuais
              </span>
              <span className="font-bold text-white">
                {metricas.anuais}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-sm text-white/55">
                Cortesias
              </span>
              <span className="font-bold text-white">
                {metricas.cortesias}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}