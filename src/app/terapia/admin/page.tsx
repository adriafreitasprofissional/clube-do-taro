"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "./components/adminFetch";

export default function TerapiaAdminPage() {
  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    adminFetch("/api/terapia/admin/dashboard")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Erro ao carregar painel.");
        }
        setDados(data);
      })
      .catch((error) =>
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar painel."
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
    return <div className="text-[#6C8465]">Carregando painel...</div>;
  }

  const cards = [
    ["Clientes ativas", dados.resumo.clientes_ativas],
    ["Sessões hoje", dados.resumo.sessoes_hoje],
    ["Anamneses recebidas", dados.resumo.anamneses_recebidas],
    ["Anamneses pendentes", dados.resumo.anamneses_pendentes],
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8AA27A]">
        Terapia em Dia
      </p>

      <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#5E7357] md:text-4xl">
            Visão Geral
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6C8465]">
            Acompanhamentos, anamneses e disponibilidade em um só lugar.
          </p>
        </div>

        <Link
          href="/terapia/admin/disponibilidade"
          className="rounded-xl bg-[#5E7357] px-5 py-3 text-center text-sm font-bold text-[#F8F4EC] shadow"
        >
          Configurar disponibilidade
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([titulo, valor]) => (
          <div
            key={titulo}
            className="rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-5 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-[#7A8D73]">
              {titulo}
            </p>

            <p className="mt-3 text-4xl font-black text-[#5E7357]">
              {valor}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6">
          <h2 className="text-xl font-extrabold text-[#5E7357]">
            Próximos atendimentos
          </h2>

          <div className="mt-5 grid gap-3">
            {dados.proximos_atendimentos
              .slice(0, 5)
              .map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#E1D6C5] bg-white/70 p-4"
                >
                  <p className="font-extrabold text-[#5E7357]">
                    {item.client_name}
                  </p>
                  <p className="mt-1 text-sm text-[#6C8465]">
                    {item.service_type} ·{" "}
                    {new Date(item.scheduled_at).toLocaleString("pt-BR")}
                  </p>
                </div>
              ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#5E7357]">
              Anamneses
            </h2>

            <Link
              href="/terapia/admin/anamneses"
              className="text-sm font-bold text-[#6C8465]"
            >
              Ver todas →
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {dados.clientes.map((cliente: any) => {
              const recebida =
                cliente.anamnese?.status === "enviada" ||
                cliente.anamnese?.status === "revisada";

              return (
                <div
                  key={cliente.id}
                  className="flex items-center justify-between rounded-2xl border border-[#E1D6C5] bg-white/70 p-4"
                >
                  <div>
                    <p className="font-bold text-[#5E7357]">
                      {cliente.nome}
                    </p>
                    <p className="mt-1 text-xs text-[#7A8D73]">
                      {recebida ? "Anamnese recebida" : "Aguardando envio"}
                    </p>
                  </div>

                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    recebida
                      ? "bg-[#DCE8D6] text-[#4F6548]"
                      : "bg-[#EFE5D3] text-[#806A55]"
                  }`}>
                    {recebida ? "Recebida" : "Pendente"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
