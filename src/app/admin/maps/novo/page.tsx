"use client";

import { useState } from "react";

import ModuleSelector, {
  ModuleSelection,
} from "@/components/maps/ModuleSelector";

import { ClientSelector } from "@/components/map-engine/ClientSelector";
import { GenerateStep } from "@/components/map-engine/generate/GenerateStep";

interface Client {
  id: string;
  nome: string;
  email: string;
  plano: string;
  status: string;

  data_nascimento?: string;
  hora_nascimento?: string;
  cidade_nascimento?: string;
  estado_nascimento?: string;
  pais_nascimento?: string;
}

const initialModules: ModuleSelection = {
  numerology: true,
  astrology: false,
  nominal: false,
  cards: false,
  business: false,
  couple: false,
  baby: false,
  house: false,
  dating: false,
};

export default function NovoMapaPage() {
  const [modules, setModules] =
    useState<ModuleSelection>(initialModules);

  const [client, setClient] =
    useState<Client | null>(null);

  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen w-full">

      {/* TELA 1 */}
      {!client && step === 1 && (
        <div className="mx-auto w-full max-w-7xl px-6 py-10">

          <div className="mb-10">
            <h1 className="text-5xl font-light tracking-[0.18em] text-[#F5F2FF]">
              PORTAL DOS MAPAS
            </h1>

            <p className="mt-3 text-sm tracking-[0.12em] text-[#A994C7]">
              AF Framework • Clube do Tarô
            </p>

            <p className="mt-5 text-base text-[#CFC7E8]">
              Selecione os mapas que deseja revelar e escolha a cliente.
            </p>
          </div>

          <ModuleSelector
            value={modules}
            onChange={setModules}
          />

          <div className="mt-14">

            <div className="mb-6">
              <h2 className="text-3xl font-light tracking-[0.12em] text-[#F5F2FF]">
                SELECIONE UMA CLIENTE
              </h2>

              <p className="mt-2 text-[#A994C7]">
                Pesquise pelo nome, e-mail ou WhatsApp.
              </p>
            </div>

            <ClientSelector
              onNext={(selectedClient) => {
                console.log("CLIENTE SELECIONADA:", selectedClient);

                setClient(selectedClient);
                setStep(2);
              }}
            />

          </div>

        </div>
      )}

      {/* TELA 2 — MAPA */}
      {client && step === 2 && (
        <div className="w-full">
          <GenerateStep client={client} />
        </div>
      )}

    </div>
  );
}