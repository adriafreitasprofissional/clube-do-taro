"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "../components/adminFetch";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[] | null>(null);

  useEffect(() => {
    adminFetch("/api/terapia/admin/dashboard")
      .then((response) => response.json())
      .then((data) => setClientes(data.clientes || []));
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8AA27A]">
        Terapia em Dia
      </p>

      <h1 className="mt-2 text-3xl font-extrabold text-[#5E7357]">
        Clientes
      </h1>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clientes?.map((cliente) => (
          <div
            key={cliente.id}
            className="rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-5"
          >
            <p className="text-lg font-extrabold text-[#5E7357]">
              {cliente.nome}
            </p>

            <p className="mt-1 text-xs text-[#7A8D73]">
              {cliente.nome_completo}
            </p>

            <Link
              href={`/terapia/admin/anamneses/${cliente.id}`}
              className="mt-5 inline-flex rounded-xl border border-[#9FB093] px-3 py-2 text-xs font-bold text-[#5E7357]"
            >
              Ver anamnese
            </Link>
          </div>
        ))}

        {!clientes && <p className="text-sm text-[#6C8465]">Carregando...</p>}
      </div>
    </div>
  );
}
