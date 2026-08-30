"use client";

import { useState } from "react";

interface Props {
  client: any;
  onNext: (client: any) => void;
  onBack: () => void;
}

const estados = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

export function BirthStep({
  client,
  onNext,
  onBack,
}: Props) {
  const [form, setForm] = useState({
    ...client,
  });

  function update(
    field: string,
    value: string
  ) {
    setForm((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-3xl font-bold">
          Dados de Nascimento
        </h2>

        <p className="mt-2 text-zinc-400">
          Complete os dados da cliente.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <input
          type="date"
          value={form.data_nascimento ?? ""}
          onChange={(e) =>
            update(
              "data_nascimento",
              e.target.value
            )
          }
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-4"
        />

        <input
          type="time"
          value={form.hora_nascimento ?? ""}
          onChange={(e) =>
            update(
              "hora_nascimento",
              e.target.value
            )
          }
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-4"
        />

        <input
          placeholder="Cidade de nascimento"
          value={form.cidade_nascimento ?? ""}
          onChange={(e) =>
            update(
              "cidade_nascimento",
              e.target.value
            )
          }
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-4"
        />

        <select
          value={form.estado_nascimento ?? ""}
          onChange={(e) =>
            update(
              "estado_nascimento",
              e.target.value
            )
          }
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white"
        >
          <option value="">
            Selecione o estado
          </option>

          {estados.map((estado) => (
            <option
              key={estado.sigla}
              value={estado.sigla}
            >
              {estado.sigla} — {estado.nome}
            </option>
          ))}
        </select>

        <input
          placeholder="País"
          value={form.pais_nascimento ?? "Brasil"}
          onChange={(e) =>
            update(
              "pais_nascimento",
              e.target.value
            )
          }
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-4"
        />

      </div>

      <div className="flex gap-4">

        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-8 py-4 font-bold text-white"
        >
          ← Voltar
        </button>

        <button
          type="button"
          onClick={() => onNext(form)}
          className="rounded-xl bg-yellow-500 px-8 py-4 font-bold text-black"
        >
          Salvar e Continuar
        </button>

      </div>

    </div>
  );
}