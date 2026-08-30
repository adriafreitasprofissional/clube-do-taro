"use client";

import { useState } from "react";

import { ClientSelector } from "./ClientSelector";
import { BirthStep } from "./BirthStep";
import { GenerateStep } from "./generate/GenerateStep";

interface Client {
  id: string;
  nome: string;
  email: string;
  plano: string;

  data_nascimento?: string;
  hora_nascimento?: string;
  cidade_nascimento?: string;
  estado_nascimento?: string;
  pais_nascimento?: string;
}

export function Wizard() {
  const [step, setStep] = useState(1);
  const [client, setClient] = useState<Client | null>(null);

  function voltarParaClientes() {
    setClient(null);
    setStep(1);
  }

  return (
    <div className="mx-auto max-w-7xl p-10">

      <h1 className="text-4xl font-bold text-yellow-400">
        Motor de Mapas Premium
      </h1>

      <p className="mt-2 text-zinc-400">
        AF Framework
      </p>

      <div className="mt-10">

        {step === 1 && (
          <ClientSelector
            onNext={(selectedClient) => {
              setClient(selectedClient);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <BirthStep
            client={client}
            onBack={voltarParaClientes}
            onNext={(updatedClient) => {
              setClient(updatedClient);
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <GenerateStep
            client={client}
            onBack={voltarParaClientes}
          />
        )}

      </div>

    </div>
  );
}