"use client";

import { pdf } from "@react-pdf/renderer";
import DirecionamentoPDF from "./DirecionamentoPDF";

type Props = {
  leitura: any;
};

export default function BotaoPDF({ leitura }: Props) {

  async function baixarPDF() {
  const blob = await pdf(
    <DirecionamentoPDF leitura={leitura} />
  ).toBlob();

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `Direcionamento-${leitura.assinante}.pdf`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

  return (
    <button
      onClick={baixarPDF}
      className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-6 py-4 font-semibold text-yellow-300 hover:bg-yellow-500/20 transition"
    >
      📄 PDF
    </button>
  );
}