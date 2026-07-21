"use client";

import { useState } from "react";
import type { Direcionamento } from "@/types/direcionamento";

export default function GeradorDirecionamentoPage() {

  const [nome, setNome] = useState("");
  const [plano, setPlano] = useState("");
  const [semana, setSemana] = useState("3ª Semana");
  const [periodo, setPeriodo] = useState("19/07/2026 a 26/07/2026");
  const [resultado, setResultado] = useState<Direcionamento | null>(null);
  const [gerando, setGerando] = useState(false);


  async function gerarDirecionamento() {
  try {
    setGerando(true);

    const response = await fetch("/api/gerador-direcionamento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  nome,
  plano,
  semana,
  periodo,
}),
    });

    const data = await response.json();

    setResultado(data);
  } catch (err) {
    console.error(err);
    alert("Erro ao gerar direcionamento.");
  } finally {
    setGerando(false);
  }
}
  return (
    <main className="max-w-7xl mx-auto p-8 space-y-8">

      <h1 className="text-4xl font-bold text-yellow-400">
        Gerador de Direcionamentos
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

<input
  className="rounded-xl border p-4 bg-zinc-900"
  placeholder="Nome da assinante"
  value={nome}
  onChange={(e) => setNome(e.target.value)}
/>

<input
  className="rounded-xl border p-4 bg-zinc-900"
  placeholder="Plano"
  value={plano}
  onChange={(e) => setPlano(e.target.value)}
/>

<input
  className="rounded-xl border p-4 bg-zinc-900"
  placeholder="Semana"
  value={semana}
  onChange={(e) => setSemana(e.target.value)}
/>

<input
  className="rounded-xl border p-4 bg-zinc-900"
  placeholder="Período"
  value={periodo}
  onChange={(e) => setPeriodo(e.target.value)}
/>
  
</div>  

<div className="rounded-2xl border border-yellow-500/20 bg-[#151221] p-6 space-y-5">

  
  <h2 className="text-2xl font-bold text-yellow-400">
    Pré-visualização do Direcionamento
  </h2>

  <div className="rounded-xl bg-[#201a35] p-5">
    <h3 className="text-lg font-bold text-yellow-300">
      Numerologia
    </h3>

    <p className="mt-3 text-purple-100">
      {resultado?.numerologia.vibracaoSemana ?? "Aguardando geração..."}
    </p>
  </div>

  <div className="rounded-xl bg-[#201a35] p-5">
    <h3 className="text-lg font-bold text-yellow-300">
      Orixá
    </h3>

    <p className="mt-3 text-purple-100">
      {resultado?.orixa.texto ?? "Aguardando geração..."}
    </p>

  </div>

  <div className="rounded-xl bg-[#201a35] p-5">
    <h3 className="text-lg font-bold text-yellow-300">
      Carta Cigana
    </h3>

    <p className="mt-3 text-purple-100">
      {resultado?.carta.texto ?? "Aguardando geração..."}
    </p>
  </div>

  <div className="rounded-xl bg-[#201a35] p-5">
    <h3 className="text-lg font-bold text-yellow-300">
      Tarô
    </h3>

    <p className="mt-3 text-purple-100">
      {resultado?.taro.texto ?? "Aguardando geração..."}
    </p>
  </div>
 </div>
<button
  onClick={gerarDirecionamento}
  className="w-full rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-400 py-4 text-lg font-bold text-[#151221] transition hover:scale-[1.02]"
>
  {gerando ? "GERANDO..." : "GERAR DIRECIONAMENTO"}
</button>


    </main>
  );
}