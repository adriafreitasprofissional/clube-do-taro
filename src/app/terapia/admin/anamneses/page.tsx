"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "../components/adminFetch";

export default function AnamnesesPage() {
  const [clientes, setClientes] = useState<any[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    adminFetch("/api/terapia/admin/anamneses")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Erro ao carregar anamneses.");
        setClientes(data.clientes || []);
      })
      .catch((error) =>
        setErro(error instanceof Error ? error.message : "Erro ao carregar anamneses.")
      );
  }, []);

  if (erro) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
        {erro}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8AA27A]">
        Terapia em Dia
      </p>

      <h1 className="mt-2 text-3xl font-extrabold text-[#5E7357]">
        Anamneses
      </h1>

      <p className="mt-2 text-sm text-[#6C8465]">
        Veja quem já enviou e quem ainda precisa preencher.
      </p>

      <div className="mt-7 grid gap-4">
        {!clientes && <p className="text-[#6C8465]">Carregando...</p>}

        {clientes?.map((cliente) => {
          const recebida =
            cliente.anamnese?.status === "enviada" ||
            cliente.anamnese?.status === "revisada";

          return (
            <div
              key={cliente.id}
              className="flex flex-col gap-4 rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-lg font-extrabold text-[#5E7357]">
                  {cliente.nome}
                </p>

                <p className="mt-1 text-xs text-[#7A8D73]">
                  {cliente.nome_completo}
                </p>

                {recebida && cliente.anamnese?.submitted_at && (
                  <p className="mt-2 text-xs text-[#6C8465]">
                    Recebida em{" "}
                    {new Date(cliente.anamnese.submitted_at).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-2 text-xs font-bold ${
                  recebida
                    ? "bg-[#DCE8D6] text-[#4F6548]"
                    : "bg-[#EFE5D3] text-[#806A55]"
                }`}>
                  {recebida ? "✓ Recebida" : "Pendente"}
                </span>

                {recebida && (
                  <Link
                    href={`/terapia/admin/anamneses/${cliente.id}`}
                    className="rounded-xl bg-[#5E7357] px-4 py-2 text-sm font-bold text-[#F8F4EC]"
                  >
                    Abrir anamnese
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
