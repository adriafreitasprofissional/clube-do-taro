"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string;
  nome: string;
  nome_referencia?: string | null;
  plano?: string | null;
  status?: string | null;
  tipo_assinatura?: string | null;
};
type Escuta = {
  id: string;
  cliente_id: string;
  slug: string;
  ano: string;
  mes: string;
  semana: string;
  tipo: string;
  first_listened_at: string;
  last_listened_at: string;
  listen_count: number;
};
const categorias = [
  "Bronze",
  "Prata",
  "Ouro",
  "Diamante",
  "Cortesias",
  "Cursos",
  "Serviços",
] as const;

function normalizarPlano(plano?: string | null) {
  const valor = (plano || "").trim().toLowerCase();

  if (valor === "bronze") return "Bronze";
  if (valor === "prata") return "Prata";
  if (valor === "ouro") return "Ouro";
  if (valor === "diamante") return "Diamante";
  if (valor === "cursos" || valor === "curso") return "Cursos";
  if (valor === "serviços" || valor === "servicos" || valor === "serviço") {
    return "Serviços";
  }

  return null;
}

export default function PainelAssiduidade() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
const [escutas, setEscutas] = useState<Escuta[]>([]);
  const [painelAberto, setPainelAberto] = useState(false);

  const [categoriaAberta, setCategoriaAberta] = useState<string | null>(
    null
  );

  useEffect(() => {
    carregarDados();
  }, []);

async function carregarDados() {
  await Promise.all([
    carregarClientes(),
    carregarEscutas(),
  ]);
}

async function carregarEscutas() {
  const { data, error } = await supabase
    .from("direction_listens")
    .select("*")
    .eq("tipo", "audio")
    .order("last_listened_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Erro ao carregar assiduidade:",
      error
    );
    return;
  }

  setEscutas((data || []) as Escuta[]);
}



  async function carregarClientes() {
    try {
      setCarregando(true);

      const response = await fetch("/api/admin/clientes", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Não foi possível carregar os assinantes.");
      }

      const data = await response.json();

      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar assinantes:", error);
      setClientes([]);
    } finally {
      setCarregando(false);
    }
  }

  const total = clientes.length;

  /*
    A assiduidade real ainda será conectada ao registro
    de reprodução dos áudios.

    Por enquanto estes dois indicadores ficam zerados
    para não inventarmos dados de consumo.
  */
  const precisamAtencao = 0;
  const cortesiasEmRisco = 0;

  return (
    <section className="mt-8">
      <div className="mb-5">
        <p className="mb-1 text-sm uppercase tracking-[0.2em] text-[#E7C96F]">
          Acompanhamento
        </p>

        <h2 className="text-3xl font-bold text-white">
          Painel de Assiduidade
        </h2>

        <p className="mt-2 max-w-3xl text-base leading-7 text-white/65">
          Acompanhe quem está ouvindo os Direcionamentos e identifique
          quedas de participação.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#28002f] p-5">
          <p className="text-sm uppercase tracking-wider text-white/45">
            Assinantes
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {carregando ? "..." : total}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#28002f] p-5">
          <p className="text-sm uppercase tracking-wider text-white/45">
            Ativos
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {carregando
              ? "..."
              : clientes.filter(
                  (cliente) =>
                    (cliente.status || "").toLowerCase() === "ativo"
                ).length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#28002f] p-5">
          <p className="text-sm uppercase tracking-wider text-white/45">
            Precisam de atenção
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {precisamAtencao}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#28002f] p-5">
          <p className="text-sm uppercase tracking-wider text-white/45">
            Cortesias em risco
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {cortesiasEmRisco}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-[#28002f]">
        <button
          type="button"
          onClick={() => setPainelAberto(!painelAberto)}
          className="flex w-full items-center justify-between px-5 py-5 text-left"
        >
          <div>
            <p className="text-lg font-bold text-white">
              👥 Assinantes
            </p>

            <p className="mt-1 text-sm text-white/55">
              Total: {carregando ? "Carregando..." : total}
            </p>
          </div>

          <span className="text-xl text-[#E7C96F]">
            {painelAberto ? "▲" : "▼"}
          </span>
        </button>

        {painelAberto && (
          <div className="border-t border-white/10 px-5 pb-5">
            {categorias.map((categoria) => {
             const itens =
  categoria === "Cortesias"
    ? clientes.filter(
        (cliente) =>
          (cliente.tipo_assinatura || "")
            .toLowerCase()
            .trim() === "cortesia"
      )
    : clientes.filter(
        (cliente) =>
          normalizarPlano(cliente.plano) === categoria
      );

              const aberta = categoriaAberta === categoria;

              return (
                <div
                  key={categoria}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setCategoriaAberta(aberta ? null : categoria)
                    }
                    className="flex w-full items-center justify-between py-4 text-left"
                  >
                    <span className="text-base font-semibold text-white">
                      {aberta ? "▼" : "▶"} {categoria}
                    </span>

                    <span className="text-base font-bold text-white">
                      {itens.length}
                    </span>
                  </button>

                  {aberta && (
                    <div className="space-y-3 pb-4">
                      {itens.length === 0 ? (
                        <div className="rounded-xl bg-[#1d0023] p-4 text-sm text-white/45">
                          Nenhum assinante nesta categoria.
                        </div>
                      ) : (
                        itens.map((cliente) => {
                          const cortesia =
                            (cliente.tipo_assinatura || "")
                              .toLowerCase()
                              .trim() === "cortesia";

                          return (
                            <div
                              key={cliente.id}
                              className="rounded-2xl border border-white/10 bg-[#1d0023] p-4"
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-base font-semibold text-white">
                                      {cliente.nome_referencia ||
                                        cliente.nome}
                                    </h3>

                                    {cortesia && (
                                      <span className="rounded-full border border-purple-300/20 bg-purple-400/10 px-2 py-1 text-xs text-purple-200">
                                        Cortesia
                                      </span>
                                    )}

                                    <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-white/55">
                                      {cliente.status || "Sem status"}
                                    </span>
                                  </div>

                                  {cliente.nome_referencia &&
                                    cliente.nome_referencia !==
                                      cliente.nome && (
                                      <p className="mt-2 text-sm text-white/45">
                                        {cliente.nome}
                                      </p>
                                    )}
                                </div>

                                <div className="text-left sm:text-right">
                                  <p className="text-xs uppercase tracking-wider text-white/35">
                                    Assiduidade
                                  </p>

                                  {(() => {
  const escutasCliente = escutas.filter(
    (escuta) =>
      escuta.cliente_id === cliente.id
  );

  if (escutasCliente.length === 0) {
    return (
      <p className="mt-1 text-sm font-semibold text-white/55">
        Ainda não ouviu nenhum áudio
      </p>
    );
  }

  const ultimaEscuta = escutasCliente[0];

  const totalDirecionamentos =
    escutasCliente.length;

  const totalReproducoes =
    escutasCliente.reduce(
      (total, escuta) =>
        total + (escuta.listen_count || 0),
      0
    );

  return (
    <div className="mt-1">
      <p className="text-sm font-semibold text-green-300">
        ✓ Ouviu {totalDirecionamentos}{" "}
        direcionamento
        {totalDirecionamentos !== 1
          ? "s"
          : ""}
      </p>

      <p className="mt-1 text-xs text-white/45">
        Última escuta:{" "}
        {new Date(
          ultimaEscuta.last_listened_at
        ).toLocaleDateString("pt-BR")}
      </p>

      <p className="mt-1 text-xs text-white/35">
        {totalReproducoes} reprodução
        {totalReproducoes !== 1 ? "ões" : ""}
      </p>
    </div>
  );
})()}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}