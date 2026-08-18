"use client";

import { Download } from "lucide-react";
import { generatePdf } from "./pdf/generatePdf";

interface Props {
  resultado: any;
}

export function GenerateStepPDF({
  resultado,
}: Props) {
  async function visualizarPDF() {
    await generatePdf(resultado);
  }

  return (
    <div className="mt-10">
      <button
        type="button"
        onClick={visualizarPDF}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-yellow-500 bg-[#1A132C] py-5 text-lg font-semibold text-yellow-400 transition-all duration-300 hover:bg-yellow-500 hover:text-[#22163A]"
      >
        <Download size={22} />
        Visualizar PDF Premium
      </button>
    </div>
  );
}