"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { generatePdf } from "./pdf/generatePdf";

interface Props {
  resultado: any;
  nome?: string;
}

export function GenerateStepPDF({
  resultado,
  nome,
}: Props) {
  const [gerando, setGerando] = useState(false);

  async function visualizarPDF() {
    if (gerando) return;

    try {
      setGerando(true);

      console.log("CLIQUE PDF");

      await generatePdf(
        resultado,
        nome
      );

      console.log(
        "GERADOR TERMINOU"
      );
    } catch (error) {
      console.error(
        "ERRO PDF:",
        error
      );

      alert(
        "Não foi possível gerar o PDF."
      );
    } finally {
      setGerando(false);
    }
  }

  return (
    <button
      type="button"
      onClick={visualizarPDF}
      disabled={gerando}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#D4AF37] bg-[#1A132C] py-5 text-lg font-semibold text-[#D4AF37] transition hover:bg-[#2C2047] disabled:cursor-wait disabled:opacity-70"
    >
      {gerando ? (
        <>
          <Loader2
            size={22}
            className="animate-spin"
          />

          <span>
            Gerando seu PDF...
          </span>
        </>
      ) : (
        <>
          <Download size={22} />

          <span>
            Visualizar PDF Premium
          </span>
        </>
      )}
    </button>
  );
}
