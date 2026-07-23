"use client";

type Props = {
  leitura?: any;
};

export default function BotaoPDF({ leitura }: Props) {
  const gerarPDF = () => {
    window.print();
  };

  return (
    <button
      onClick={gerarPDF}
      className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-6 py-4 font-semibold text-yellow-300 hover:bg-yellow-500/20 transition"
    >
      📄 Baixar PDF
    </button>
  );
}