"use client"

import { useState } from "react"

import { MapViewer } from "@/components/maps/MapViewer"

export default function GeradorMapasPage() {

  const [resultado, setResultado] = useState<any>(null)
  const [gerando, setGerando] = useState(false)
const [nome, setNome] = useState("")
const [dataNascimento, setDataNascimento] = useState("")
const [horaNascimento, setHoraNascimento] = useState("")
const [cidade, setCidade] = useState("")
const [estado, setEstado] = useState("")

  async function gerarMapa() {

    try {

      setGerando(true)

      const response = await fetch("/api/map/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  nome,
  dataNascimento,
  horaNascimento,
  cidade,
  estado,
}),
      })

      const data = await response.json()

      setResultado(data)

    } finally {

      setGerando(false)

    }

  }

  return (

    <main className="max-w-6xl mx-auto p-8 space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Motor de Mapas Premium
        </h1>

        <p className="text-zinc-400 mt-2">
          AF Framework
        </p>

      </div>

      <button
        onClick={gerarMapa}
        disabled={gerando}
        className="rounded-xl bg-purple-700 px-8 py-4 text-white font-bold"
      >
        {gerando
          ? "Gerando..."
          : "Gerar Mapa"}
      </button>

      {resultado && (
        <MapViewer map={resultado} />
      )}
<div className="grid grid-cols-2 gap-4">

  <input
    type="text"
    placeholder="Nome Completo"
    value={nome}
    onChange={(e) => setNome(e.target.value)}
    className="border rounded-lg p-3 bg-zinc-900"
  />

  <input
    type="date"
    value={dataNascimento}
    onChange={(e) => setDataNascimento(e.target.value)}
    className="border rounded-lg p-3 bg-zinc-900"
  />

  <input
    type="time"
    value={horaNascimento}
    onChange={(e) => setHoraNascimento(e.target.value)}
    className="border rounded-lg p-3 bg-zinc-900"
  />

  <input
    type="text"
    placeholder="Cidade"
    value={cidade}
    onChange={(e) => setCidade(e.target.value)}
    className="border rounded-lg p-3 bg-zinc-900"
  />

  <input
    type="text"
    placeholder="Estado"
    value={estado}
    onChange={(e) => setEstado(e.target.value)}
    className="border rounded-lg p-3 bg-zinc-900"
  />

</div>
    </main>

  )

}