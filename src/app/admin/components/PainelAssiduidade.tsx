"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string;
  nome: string;
  nome_referencia?: string | null;
  plano?: string | null;
  status?: string | null;
  tipo_assinatura?: string | null;
  slug?: string | null;
  data_inicio?: string | null;
};

type Escuta = {
  id: string;
  cliente_id: string;
  slug?: string | null;
  ano: string;
  mes: string;
  semana: string;
  tipo: string;
  first_listened_at: string;
  last_listened_at: string;
  listen_count: number;
};

type ConteudoDirecionamento = {
  id: string;
  client_id: string;
  slug?: string | null;
  ano: string;
  mes: string;
  semana: string;
  tipo: string;
  ativo: boolean;
  released_at?: string | null;
};

const categorias = [
  "Bronze",
  "Prata",
  "Ouro",
  "Diamante",
  "Cortesias",
  "Cursos",
  "Serviços",
  "Outros",
] as const;

const MESES: Record<
  string,
  number
> = {
  janeiro: 1,
  fevereiro: 2,
  março: 3,
  marco: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
};

function normalizarTexto(
  valor?: string | null
) {
  return (valor || "")
    .trim()
    .toLowerCase();
}

function normalizarPlano(
  plano?: string | null
) {
  const valor =
    normalizarTexto(plano);

  if (valor === "bronze")
    return "Bronze";

  if (valor === "prata")
    return "Prata";

  if (valor === "ouro")
    return "Ouro";

  if (valor === "diamante")
    return "Diamante";

  if (
    valor === "cursos" ||
    valor === "curso"
  ) {
    return "Cursos";
  }

  if (
    valor === "serviços" ||
    valor === "servicos" ||
    valor === "serviço" ||
    valor === "servico"
  ) {
    return "Serviços";
  }

  return null;
}

function ehCortesia(
  cliente: Cliente
) {
  return (
    normalizarTexto(
      cliente.tipo_assinatura
    ) === "cortesia"
  );
}

function numeroMes(
  mes?: string | null
) {
  const valor =
    normalizarTexto(mes);

  if (/^\d+$/.test(valor)) {
    return Number(valor);
  }

  return MESES[valor] || 0;
}

function ordenarConteudos(
  conteudos:
    ConteudoDirecionamento[]
) {
  return [...conteudos].sort(
    (a, b) => {
      const chaveA =
        Number(a.ano) *
          10000 +
        numeroMes(a.mes) *
          100 +
        Number(a.semana);

      const chaveB =
        Number(b.ano) *
          10000 +
        numeroMes(b.mes) *
          100 +
        Number(b.semana);

      return chaveA - chaveB;
    }
  );
}

function mesmoPeriodo(
  escuta: Escuta,
  conteudo:
    ConteudoDirecionamento
) {
  return (
    String(escuta.ano) ===
      String(conteudo.ano) &&
    numeroMes(escuta.mes) ===
      numeroMes(
        conteudo.mes
      ) &&
    String(
      escuta.semana
    ) ===
      String(
        conteudo.semana
      )
  );
}

export default function PainelAssiduidade() {
  const [
    clientes,
    setClientes,
  ] = useState<Cliente[]>([]);

  const [
    escutas,
    setEscutas,
  ] = useState<Escuta[]>([]);

  const [
    conteudos,
    setConteudos,
  ] = useState<
    ConteudoDirecionamento[]
  >([]);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    erro,
    setErro,
  ] = useState<
    string | null
  >(null);

  const [
    painelAberto,
    setPainelAberto,
  ] = useState(false);

  const [
    categoriaAberta,
    setCategoriaAberta,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro(null);

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (
        !session?.access_token
      ) {
        throw new Error(
          "Sua sessão administrativa expirou."
        );
      }

      const response =
        await fetch(
          "/api/admin/assiduidade",
          {
            cache:
              "no-store",
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível carregar a assiduidade."
        );
      }

      setClientes(
        Array.isArray(
          data.clientes
        )
          ? data.clientes
          : []
      );

      setEscutas(
        Array.isArray(
          data.escutas
        )
          ? data.escutas
          : []
      );

      setConteudos(
        ordenarConteudos(
          Array.isArray(
            data.conteudos
          )
            ? data.conteudos
            : []
        )
      );
    } catch (error) {
      console.error(
        "Erro ao carregar assiduidade:",
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar assiduidade."
      );

      setClientes([]);
      setEscutas([]);
      setConteudos([]);
    } finally {
      setCarregando(false);
    }
  }

  function obterMetricasCliente(
    cliente: Cliente
  ) {
    const escutasCliente =
      escutas.filter(
        (escuta) =>
          escuta.cliente_id ===
          cliente.id
      );

    const conteudosCliente =
      conteudos.filter(
        (conteudo) =>
          conteudo.client_id ===
          cliente.id
      );

    const foiConsumido = (
      conteudo:
        ConteudoDirecionamento
    ) =>
      escutasCliente.some(
        (escuta) =>
          mesmoPeriodo(
            escuta,
            conteudo
          )
      );

    const produzidos =
      conteudosCliente.length;

    const consumidos =
      conteudosCliente.filter(
        foiConsumido
      ).length;

    const percentual =
      produzidos > 0
        ? Math.round(
            (consumidos /
              produzidos) *
              100
          )
        : 0;

    let semanasSemOuvir = 0;

    for (
      let i =
        conteudosCliente.length -
        1;
      i >= 0;
      i--
    ) {
      if (
        foiConsumido(
          conteudosCliente[i]
        )
      ) {
        break;
      }

      semanasSemOuvir++;
    }

    const totalReproducoes =
      escutasCliente.reduce(
        (
          total,
          escuta
        ) =>
          total +
          Number(
            escuta.listen_count ||
              0
          ),
        0
      );

    const ultimaEscuta =
      escutasCliente.length > 0
        ? escutasCliente[0]
        : null;

    return {
      produzidos,
      consumidos,
      percentual,
      semanasSemOuvir,
      totalReproducoes,
      ultimaEscuta,
    };
  }

  const clientesAtivos =
    useMemo(
      () =>
        clientes.filter(
          (cliente) =>
            normalizarTexto(
              cliente.status
            ) === "ativo"
        ),
      [clientes]
    );

  const total =
    clientesAtivos.length;

  const precisamAtencao =
    clientesAtivos.filter(
      (cliente) => {
        const metricas =
          obterMetricasCliente(
            cliente
          );

        return (
          metricas.produzidos >
            0 &&
          metricas.semanasSemOuvir >=
            1
        );
      }
    ).length;

  const cortesiasEmRisco =
    clientesAtivos.filter(
      (cliente) => {
        if (
          !ehCortesia(
            cliente
          )
        ) {
          return false;
        }

        const metricas =
          obterMetricasCliente(
            cliente
          );

        return (
          metricas.semanasSemOuvir >=
          2
        );
      }
    ).length;

  const lidos =
    clientesAtivos.filter(
      (cliente) =>
        obterMetricasCliente(
          cliente
        ).consumidos > 0
    ).length;

  function clientesDaCategoria(
    categoria:
      (typeof categorias)[number]
  ) {
    if (
      categoria ===
      "Cortesias"
    ) {
      return clientesAtivos.filter(
        ehCortesia
      );
    }

    if (
      categoria === "Outros"
    ) {
      return clientesAtivos.filter(
        (cliente) =>
          !ehCortesia(
            cliente
          ) &&
          !normalizarPlano(
            cliente.plano
          )
      );
    }

    return clientesAtivos.filter(
      (cliente) =>
        !ehCortesia(
          cliente
        ) &&
        normalizarPlano(
          cliente.plano
        ) === categoria
    );
  }

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
          Acompanhe quem está ouvindo os Direcionamentos e identifique quedas de participação.
        </p>
      </div>

      {erro && (
        <div className="mb-5 rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200">
          {erro}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Resumo
          titulo="Assinantes"
          valor={
            carregando
              ? "..."
              : total
          }
        />

        <Resumo
          titulo="Ativos"
          valor={
            carregando
              ? "..."
              : clientesAtivos.length
          }
        />

        <Resumo
          titulo="Precisam de atenção"
          valor={
            carregando
              ? "..."
              : precisamAtencao
          }
        />

        <Resumo
          titulo="Cortesias em risco"
          valor={
            carregando
              ? "..."
              : cortesiasEmRisco
          }
        />

        <Resumo
          titulo="Lidos"
          valor={
            carregando
              ? "..."
              : lidos
          }
        />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-[#28002f]">
        <button
          type="button"
          onClick={() =>
            setPainelAberto(
              !painelAberto
            )
          }
          className="flex w-full items-center justify-between px-5 py-5 text-left"
        >
          <div>
            <p className="text-lg font-bold text-white">
              👥 Assinantes
            </p>

            <p className="mt-1 text-sm text-white/55">
              Total:{" "}
              {carregando
                ? "Carregando..."
                : total}
            </p>
          </div>

          <span className="rounded-xl border border-[#E7C96F]/25 bg-[#E7C96F]/10 px-3 py-2 text-sm font-bold text-[#E7C96F]">
            {painelAberto
              ? "– Fechar"
              : "+ Abrir"}
          </span>
        </button>

        {painelAberto && (
          <div className="border-t border-white/10 px-5 pb-5">
            {categorias.map(
              (categoria) => {
                const itens =
                  clientesDaCategoria(
                    categoria
                  );

                if (
                  categoria ===
                    "Outros" &&
                  itens.length === 0
                ) {
                  return null;
                }

                const aberta =
                  categoriaAberta ===
                  categoria;

                return (
                  <div
                    key={
                      categoria
                    }
                    className="border-b border-white/10 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setCategoriaAberta(
                          aberta
                            ? null
                            : categoria
                        )
                      }
                      className="flex w-full items-center justify-between gap-3 py-4 text-left"
                    >
                      <span className="text-base font-semibold text-white">
                        {
                          categoria
                        }
                      </span>

                      <span className="flex items-center gap-3">
                        <span className="text-base font-bold text-white">
                          {
                            itens.length
                          }
                        </span>

                        <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#E7C96F]">
                          {aberta
                            ? "– Fechar"
                            : "+ Abrir"}
                        </span>
                      </span>
                    </button>

                    {aberta && (
                      <div className="space-y-3 pb-4">
                        {itens.length ===
                        0 ? (
                          <div className="rounded-xl bg-[#1d0023] p-4 text-sm text-white/45">
                            Nenhum assinante nesta categoria.
                          </div>
                        ) : (
                          itens.map(
                            (
                              cliente
                            ) => (
                              <ClienteCard
                                key={
                                  cliente.id
                                }
                                cliente={
                                  cliente
                                }
                                metricas={obterMetricasCliente(
                                  cliente
                                )}
                              />
                            )
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Resumo({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#28002f] p-5">
      <p className="text-sm uppercase tracking-wider text-white/45">
        {titulo}
      </p>

      <p className="mt-2 text-3xl font-bold text-white">
        {valor}
      </p>
    </div>
  );
}

function ClienteCard({
  cliente,
  metricas,
}: {
  cliente: Cliente;
  metricas: {
    produzidos: number;
    consumidos: number;
    percentual: number;
    semanasSemOuvir: number;
    totalReproducoes: number;
    ultimaEscuta:
      | Escuta
      | null;
  };
}) {
  const cortesia =
    ehCortesia(cliente);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1d0023] p-4">
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
              {cliente.status ||
                "Sem status"}
            </span>
          </div>

          {cliente.nome_referencia &&
            cliente.nome_referencia !==
              cliente.nome && (
              <p className="mt-2 text-sm text-white/45">
                {cliente.nome}
              </p>
            )}

          {cliente.plano && (
            <p className="mt-1 text-xs text-white/35">
              Plano:{" "}
              {cliente.plano}
            </p>
          )}
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs uppercase tracking-wider text-white/35">
            Assiduidade
          </p>

          {metricas.produzidos ===
          0 ? (
            <div className="mt-1">
              <p className="text-sm font-semibold text-white/55">
                Nenhum direcionamento liberado
              </p>
            </div>
          ) : (
            <div className="mt-1">
              <p
                className={`text-sm font-semibold ${
                  metricas.percentual >=
                  75
                    ? "text-green-300"
                    : metricas.percentual >=
                      50
                    ? "text-yellow-300"
                    : "text-orange-300"
                }`}
              >
                {
                  metricas.consumidos
                }
                /
                {
                  metricas.produzidos
                }{" "}
                consumidos
              </p>

              <p className="mt-1 text-xs text-white/55">
                Assiduidade:{" "}
                {
                  metricas.percentual
                }
                %
              </p>

              {metricas.ultimaEscuta ? (
                <p className="mt-1 text-xs text-white/45">
                  Última escuta:{" "}
                  {new Date(
                    metricas.ultimaEscuta.last_listened_at
                  ).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              ) : (
                <p className="mt-1 text-xs text-white/45">
                  Ainda não ouviu nenhum áudio
                </p>
              )}

              {metricas.totalReproducoes >
                0 && (
                <p className="mt-1 text-xs text-white/35">
                  {
                    metricas.totalReproducoes
                  }{" "}
                  reprodução
                  {metricas.totalReproducoes !==
                  1
                    ? "ões"
                    : ""}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
