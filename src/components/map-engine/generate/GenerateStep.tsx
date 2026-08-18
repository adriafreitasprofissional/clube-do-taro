"use client";

import { useState } from "react";

import { MapSummary } from "./premium/MapSummary";
import { PremiumChapter } from "./premium/PremiumChapter";
import { GenerateStepPDF } from "./GenerateStepPDF";

interface Client {
  id: string;
  nome: string;
  data_nascimento?: string;
  hora_nascimento?: string;
  cidade_nascimento?: string;
  estado_nascimento?: string;
  pais_nascimento?: string;
}

interface Props {
  client: Client | null;
  onBack?: () => void;
}

export function GenerateStep({
  client,
  onBack,
}: Props) {
  const [gerando, setGerando] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] =
    useState<string | null>(null);

  async function gerarMapa() {
    try {
      setGerando(true);

      const response = await fetch(
        "/api/map/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: client?.nome,
            dataNascimento:
              client?.data_nascimento,
            horaNascimento:
              client?.hora_nascimento,
            cidade:
              client?.cidade_nascimento,
            estado:
              client?.estado_nascimento,
            pais:
              client?.pais_nascimento,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Erro ao gerar mapa."
        );
      }

      setResultado(data);
      setSelectedChapter(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar mapa.");
    } finally {
      setGerando(false);
    }
  }

  function formatarData(data?: string) {
    if (!data) return "-";

    const partes = data.split("-");

    if (partes.length !== 3) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  const chapters =
    resultado?.interpretation?.chapters || [];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">

      <section className="rounded-[30px] border border-[#5A467D] bg-[#24183A] px-8 py-12 text-center">

        <p className="text-xs uppercase tracking-[0.45em] text-[#D4AF37]">
          MAPA PREMIUM
        </p>

        <h1 className="mt-6 text-5xl font-light text-[#F5F2FF]">
          {client?.nome}
        </h1>

        <p className="mt-4 text-sm text-[#B8A8D9]">
          Dados de nascimento
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-2xl bg-[#1A132C] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A994C7]">
              Nascimento
            </p>

            <p className="mt-3 text-xl text-[#F5F2FF]">
              {formatarData(
                client?.data_nascimento
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-[#1A132C] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A994C7]">
              Hora
            </p>

            <p className="mt-3 text-xl text-[#F5F2FF]">
              {client?.hora_nascimento || "-"}
            </p>
          </div>

          <div className="rounded-2xl bg-[#1A132C] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A994C7]">
              Local
            </p>

            <p className="mt-3 text-xl text-[#F5F2FF]">
              {client?.cidade_nascimento || "-"}
              {client?.estado_nascimento
                ? ` • ${client.estado_nascimento}`
                : ""}
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={gerarMapa}
          disabled={gerando}
          className="mx-auto mt-10 rounded-full border border-[#D4AF37] bg-[#1A132C] px-10 py-5 text-lg font-semibold text-[#D4AF37] transition hover:bg-[#2C2047] disabled:opacity-60"
        >
          ✦{" "}
          {gerando
            ? "Revelando seu mapa..."
            : "Revelar meu mapa"}
        </button>

      </section>

      {resultado && (
        <div
          id="premium-map"
          className="mt-8 overflow-hidden rounded-[30px] border border-[#5A467D] bg-[#24183A]"
        >

          <MapSummary
            resultado={resultado}
            selected={selectedChapter}
            onSelect={(id) => {
              setSelectedChapter(id);
            }}
          />

          <div className="flex flex-col gap-4 px-6 pb-10 md:px-10">

            <button
              type="button"
              onClick={() => onBack?.()}
              className="w-full rounded-2xl border border-[#6C4D8B] bg-[#1A132C] py-5 text-lg font-semibold text-[#D7C9E7] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              ← Voltar
            </button>

            <GenerateStepPDF
              resultado={resultado}
            />

          </div>

        </div>
      )}

      {resultado && chapters.length > 0 && (
  <div
    id="premium-pdf"
    aria-hidden="true"
    style={{
      position: "fixed",
      left: "-20000px",
      top: "0",
      width: "794px",
      margin: 0,
      padding: "32px",
      pointerEvents: "none",
      zIndex: -9999,
      background: "#24183A",
    }}
  >
    {/* CAPA */}

    <div
      className="mb-12 rounded-[38px] border border-[#6F568D] bg-[#24183A] px-10 py-20 text-center"
    >
      <p className="text-xs uppercase tracking-[0.5em] text-[#D4AF37]">
        MAPA NUMEROLÓGICO PREMIUM
      </p>

      <h1 className="mt-8 text-5xl font-light text-[#F8F3EA]">
        {client?.nome}
      </h1>

      <p className="mt-6 text-lg text-[#D8C9E8]">
        Uma leitura completa da sua jornada
      </p>

      <div className="mx-auto mt-10 h-px w-32 bg-[#D4AF37]" />

      <div className="mt-10 text-sm leading-7 text-[#D8C9E8]">
        <p>
          Nascimento:{" "}
          {formatarData(client?.data_nascimento)}
        </p>

        <p>
          Hora:{" "}
          {client?.hora_nascimento || "-"}
        </p>

        <p>
          Local:{" "}
          {client?.cidade_nascimento || "-"}
          {client?.estado_nascimento
            ? ` • ${client.estado_nascimento}`
            : ""}
        </p>
      </div>
    </div>

    {/* SUMÁRIO */}

    <div className="mb-12 rounded-[30px] border border-[#6F568D] bg-[#24183A] px-10 py-12">
      <p className="text-xs uppercase tracking-[0.4em] text-[#D4AF37]">
        SUMÁRIO DO MAPA
      </p>

      <h2 className="mt-5 text-3xl font-light text-[#F8F3EA]">
        Seus capítulos
      </h2>

      <div className="mt-8 space-y-4">
        {chapters.map(
          (chapter: any, index: number) => (
            <div
              key={
                chapter.id ||
                `chapter-${index}`
              }
              className="flex items-center gap-4 border-b border-[#6F568D]/50 pb-4"
            >
              <span className="text-sm text-[#D4AF37]">
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              <span className="text-base text-[#F8F3EA]">
                {chapter.title ||
                  `Capítulo ${index + 1}`}
              </span>
            </div>
          )
        )}
      </div>
    </div>

    {/* CAPÍTULOS */}

    {chapters.map(
      (chapter: any, index: number) => {
        if (!chapter?.content) {
          return null;
        }

        return (
          <div
            key={
              chapter.id ||
              `pdf-chapter-${index}`
            }
            className="mb-12"
          >
            <PremiumChapter
              title={
                chapter.title ||
                `Capítulo ${index + 1}`
              }
              number={
                chapter.number ??
                String(index + 1)
              }
              subtitle={
                chapter.subtitle
              }
              content={
                chapter.content
              }
            />
          </div>
        );
      }
    )}
  </div>
)}

    </div>
  );
}