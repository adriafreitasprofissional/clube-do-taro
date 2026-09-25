"use client";

import { useEffect, useMemo, useState } from "react";
import { ClientSelector } from "@/components/map-engine/ClientSelector";
import { LeituraResult } from "@/components/direcionamentos/LeituraResult";
import {
  gerarLeitura,
  type Leitura,
} from "@/lib/direcionamento-engine";
import { calculateNameVibration } from "@/modules/numerology/nameVibration";

interface Client {
  id: string;
  slug?: string;
  nome: string;
  email: string;
  plano: string;
  status: string;
}

interface UltimaSelecao {
  cliente: Client;
  dataInicio: string;
  dataFim: string;
}

const LAST_SELECTION_KEY =
  "clube-taro-gerador-direcionamento-ultima-selecao";

function toInput(d: Date) {
  const local = new Date(
    d.getTime() - d.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 10);
}

function getDefaultWeekRange() {
  const hoje = new Date();

  const inicio = new Date(hoje);
  inicio.setDate(hoje.getDate() - hoje.getDay());

  const fim = new Date(inicio);
  fim.setDate(inicio.getDate() + 6);

  return {
    inicio: toInput(inicio),
    fim: toInput(fim),
  };
}

function getDraftKey(
  clientId: string,
  dataInicio: string,
  dataFim: string
) {
  return `clube-taro-direcionamento:${clientId}:${dataInicio}:${dataFim}`;
}

export default function GeradorDirecionamentoPage() {
  const defaults = useMemo(() => getDefaultWeekRange(), []);

  const [cliente, setCliente] =
    useState<Client | null>(null);

  const [dataInicio, setDataInicio] =
    useState(defaults.inicio);

  const [dataFim, setDataFim] =
    useState(defaults.fim);

  const [leitura, setLeitura] =
    useState<Leitura | null>(null);

  const [carregado, setCarregado] =
    useState(false);

  function carregarRascunho(
    clientId: string,
    inicio: string,
    fim: string
  ) {
    try {
      const key = getDraftKey(
        clientId,
        inicio,
        fim
      );

      const salvo = localStorage.getItem(key);

      if (!salvo) {
        setLeitura(null);
        return;
      }

      const leituraSalva =
        JSON.parse(salvo) as Leitura;

      setLeitura(leituraSalva);
    } catch (error) {
      console.error(
        "Erro ao carregar rascunho:",
        error
      );

      setLeitura(null);
    }
  }

  /*
   * Ao abrir a página:
   * restaura assinante, datas e leitura.
   */
  useEffect(() => {
    try {
      const salvo =
        localStorage.getItem(
          LAST_SELECTION_KEY
        );

      if (salvo) {
        const ultima =
          JSON.parse(
            salvo
          ) as UltimaSelecao;

        if (
          ultima?.cliente?.id &&
          ultima?.dataInicio &&
          ultima?.dataFim
        ) {
          setCliente(ultima.cliente);
          setDataInicio(
            ultima.dataInicio
          );
          setDataFim(
            ultima.dataFim
          );

          const key = getDraftKey(
            ultima.cliente.id,
            ultima.dataInicio,
            ultima.dataFim
          );

          const leituraSalva =
            localStorage.getItem(key);

          if (leituraSalva) {
            setLeitura(
              JSON.parse(
                leituraSalva
              ) as Leitura
            );
          }
        }
      }
    } catch (error) {
      console.error(
        "Erro ao restaurar gerador:",
        error
      );
    } finally {
      setCarregado(true);
    }
  }, []);

  /*
   * Salvamento automático.
   * Toda mudança da leitura fica guardada.
   */
  useEffect(() => {
    if (!carregado || !cliente) {
      return;
    }

    try {
      const ultimaSelecao: UltimaSelecao = {
        cliente,
        dataInicio,
        dataFim,
      };

      localStorage.setItem(
        LAST_SELECTION_KEY,
        JSON.stringify(
          ultimaSelecao
        )
      );

      if (leitura) {
        const key = getDraftKey(
          cliente.id,
          dataInicio,
          dataFim
        );

        localStorage.setItem(
          key,
          JSON.stringify(leitura)
        );
      }
    } catch (error) {
      console.error(
        "Erro ao salvar rascunho:",
        error
      );
    }
  }, [
    carregado,
    cliente,
    dataInicio,
    dataFim,
    leitura,
  ]);

  function gerar(
    overrides: {
      orixaOverride?: string;
      focoOverride?: string;
      cartaCiganaOverride?: string;
      cartaTaroOverride?: string;
    } = {}
  ) {
    if (!cliente) {
      alert(
        "Selecione uma assinante."
      );
      return;
    }

    const inicio = dataInicio
      ? new Date(
          `${dataInicio}T00:00:00`
        )
      : undefined;

    const fim = dataFim
      ? new Date(
          `${dataFim}T00:00:00`
        )
      : undefined;

    const novaLeitura =
      gerarLeitura(cliente.nome, {
        semanaInicio: inicio,
        semanaFim: fim,
        ...overrides,
      });

    setLeitura(novaLeitura);
  }

  function contexto() {
    return {
      orixaOverride:
        leitura?.orixa,

      focoOverride:
        leitura?.foco,

      cartaCiganaOverride:
        leitura?.cartaCigana,

      cartaTaroOverride:
        leitura?.cartaTaro,
    };
  }

  function editarCampo(
    path: string,
    value: string | string[]
  ) {
    setLeitura((prev) => {
      if (!prev) return prev;

      const clone =
        structuredClone(prev);

      const keys =
        path.split(".");

      let alvo:
        Record<string, unknown> =
        clone as unknown as Record<
          string,
          unknown
        >;

      for (
        let i = 0;
        i < keys.length - 1;
        i++
      ) {
        alvo =
          alvo[
            keys[i]
          ] as Record<
            string,
            unknown
          >;
      }

      alvo[
        keys[
          keys.length - 1
        ]
      ] = value;

      return clone;
    });
  }

  function selecionarCliente(
    novoCliente: Client
  ) {
    setCliente(novoCliente);

    localStorage.setItem(
      LAST_SELECTION_KEY,
      JSON.stringify({
        cliente: novoCliente,
        dataInicio,
        dataFim,
      })
    );

    carregarRascunho(
      novoCliente.id,
      dataInicio,
      dataFim
    );
  }

  function trocarAssinante() {
    setCliente(null);
    setLeitura(null);

    localStorage.removeItem(
      LAST_SELECTION_KEY
    );
  }

  function alterarDataInicio(
    valor: string
  ) {
    setDataInicio(valor);

    if (cliente) {
      carregarRascunho(
        cliente.id,
        valor,
        dataFim
      );
    }
  }

  function alterarDataFim(
    valor: string
  ) {
    setDataFim(valor);

    if (cliente) {
      carregarRascunho(
        cliente.id,
        dataInicio,
        valor
      );
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-4xl font-bold text-yellow-400">
          Gerador de Direcionamentos
        </h1>

        <p className="mt-2 text-purple-200">
          Selecione a assinante e gere a
          leitura automática. Depois altere
          qualquer item se desejar.
        </p>

        {cliente && leitura && (
          <p className="mt-2 text-xs text-green-300">
            ✓ Rascunho salvo
            automaticamente
          </p>
        )}
      </div>

      <section className="rounded-2xl border border-purple-500/20 bg-[#151221] p-6">
        {!cliente ? (
          <ClientSelector
            onNext={(c) =>
              selecionarCliente(
                c as Client
              )
            }
          />
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-2xl border border-purple-500/30 bg-[#201a35] p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-purple-300">
                  Assinante selecionada
                </p>

                <h2 className="mt-1 text-2xl font-bold text-yellow-300">
                  {cliente.nome}
                </h2>

                <p className="mt-1 text-purple-100">
                  Plano:{" "}
                  {cliente.plano ||
                    "Não informado"}
                </p>

                <p className="mt-1 text-purple-200">
                  Vibração do Nome:{" "}
                  <strong>
                    {calculateNameVibration(
                      cliente.nome
                    )}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                onClick={trocarAssinante}
                className="rounded-xl border border-yellow-400/40 px-5 py-3 font-semibold text-yellow-300"
              >
                Trocar assinante
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-purple-200">
                Data de início

                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) =>
                    alterarDataInicio(
                      e.target.value
                    )
                  }
                  className="mt-1 w-full rounded-xl border border-purple-500/30 bg-[#1c1729] p-4 text-purple-50 outline-none focus:border-yellow-400"
                />
              </label>

              <label className="text-sm text-purple-200">
                Data de fim

                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) =>
                    alterarDataFim(
                      e.target.value
                    )
                  }
                  className="mt-1 w-full rounded-xl border border-purple-500/30 bg-[#1c1729] p-4 text-purple-50 outline-none focus:border-yellow-400"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => gerar()}
              className="w-full rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-400 py-4 text-lg font-bold text-[#151221] transition hover:scale-[1.01]"
            >
              GERAR DIRECIONAMENTO AUTOMÁTICO
            </button>
          </div>
        )}
      </section>

      {leitura && cliente && (
        <LeituraResult
  leitura={leitura}
  slug={cliente.slug || ""}
  dataInicio={dataInicio}
  dataFim={dataFim}
  onLiberado={trocarAssinante}  

          onTrocarOrixa={(v) =>
            gerar({
              ...contexto(),
              orixaOverride: v,
            })
          }
          onTrocarFoco={(v) =>
            gerar({
              ...contexto(),
              focoOverride: v,
            })
          }
          onTrocarCartaCigana={(v) =>
            gerar({
              ...contexto(),
              cartaCiganaOverride: v,
            })
          }
          onTrocarCartaTaro={(v) =>
            gerar({
              ...contexto(),
              cartaTaroOverride: v,
            })
          }
          onEditarCampo={
            editarCampo
          }
        />
      )}
    </main>
  );
}