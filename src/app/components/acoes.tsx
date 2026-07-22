"use client";

import BotaoPDF from "@/components/pdf/BotaoPDF";

type Props = {
  leitura: any;
};

export default function Acoes({ leitura }: Props) {

  return (
    
    <section className="mt-12 rounded-3xl border border-yellow-500/20 bg-[#1A1026] p-6">
      
      <div className="grid gap-4 md:grid-cols-4">

        <button className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-6 py-4 font-semibold text-yellow-300 hover:bg-yellow-500/20 transition">
          👁 Visualizar
        </button>

        <BotaoPDF leitura={leitura} />

        <button
          onClick={() => window.print()}
          className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-6 py-4 font-semibold text-yellow-300 hover:bg-yellow-500/20 transition"
        >
          🖨 Imprimir
        </button>

        <button
          disabled
          className="cursor-not-allowed rounded-2xl border border-gray-700 bg-gray-800 px-6 py-4 font-semibold text-gray-500"
        >
          🎧 Áudio (Em breve)
        </button>

      </div>
      
    </section>
  );
}