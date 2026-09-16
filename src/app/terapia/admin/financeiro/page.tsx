"use client";

import {
  useEffect,
  useState,
} from "react";
import { adminFetch } from "../components/adminFetch";

function moeda(
  valor: number
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  ).format(valor || 0);
}

export default function FinanceiroPage() {
  const [
    dados,
    setDados,
  ] = useState<any>(
    null
  );

  const [
    erro,
    setErro,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    adminFetch(
      "/api/terapia/admin/financeiro"
    )
      .then(async (
        response
      ) => {
        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Erro ao carregar financeiro."
          );
        }

        setDados(data);
      })
      .catch((error) =>
        setErro(
          error instanceof
            Error
            ? error.message
            : "Erro ao carregar financeiro."
        )
      );
  }, []);

  if (erro) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
        {erro}
      </div>
    );
  }

  if (!dados) {
    return (
      <p className="text-[#6C8465]">
        Carregando
        financeiro...
      </p>
    );
  }

  const cards = [
    [
      "Valor cadastrado",
      moeda(
        dados.resumo
          .valor_cadastrado
      ),
    ],
    [
      "Sessões com valor",
      dados.resumo
        .itens_com_valor,
    ],
    [
      "Incluídas em pacote",
      dados.resumo
        .incluidos_pacote,
    ],
    [
      "Total de sessões",
      dados.resumo
        .total_sessoes,
    ],
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8AA27A]">
        Terapia em Dia
      </p>

      <h1 className="mt-2 text-3xl font-extrabold text-[#5E7357]">
        Financeiro
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6C8465]">
        Controle básico dos
        valores cadastrados
        nos atendimentos.
        Nesta etapa, o painel
        não considera um valor
        como pago apenas por
        estar cadastrado.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          ([
            titulo,
            valor,
          ]) => (
            <div
              key={
                titulo
              }
              className="rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-5 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-[#7A8D73]">
                {
                  titulo
                }
              </p>

              <p className="mt-3 text-2xl font-black text-[#5E7357]">
                {
                  valor
                }
              </p>
            </div>
          )
        )}
      </div>

      <section className="mt-7 overflow-hidden rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4]">
        <div className="border-b border-[#DDD2C2] p-5">
          <h2 className="text-xl font-extrabold text-[#5E7357]">
            Lançamentos
          </h2>
        </div>

        <div className="divide-y divide-[#E1D6C5]">
          {dados.itens.map(
            (item: any) => (
              <div
                key={
                  item.id
                }
                className="grid gap-2 p-5 md:grid-cols-[1fr_180px_150px]"
              >
                <div>
                  <p className="font-extrabold text-[#5E7357]">
                    {
                      item.client_name
                    }
                  </p>

                  <p className="mt-1 text-sm text-[#6C8465]">
                    {
                      item.service_type
                    }{" "}
                    ·{" "}
                    {new Date(
                      item.scheduled_at
                    ).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>

                <p className="text-sm font-bold text-[#6C8465]">
                  {item.charge_type ===
                  "incluido_pacote"
                    ? "Incluído no pacote"
                    : "Avulso"}
                </p>

                <p className="text-right font-extrabold text-[#5E7357]">
                  {item.amount ===
                  null
                    ? "—"
                    : moeda(
                        item.amount
                      )}
                </p>
              </div>
            )
          )}

          {dados.itens.length ===
            0 && (
            <p className="p-5 text-sm text-[#6C8465]">
              Nenhum lançamento
              ainda.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
