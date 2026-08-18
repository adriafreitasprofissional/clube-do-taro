"use client"

import { NumerologySection } from "./NumerologySection"

interface MapViewerProps {
  map: any
}

export function MapViewer({
  map,
}: MapViewerProps) {

  if (!map) return null

  return (

    <div className="max-w-5xl mx-auto space-y-10 p-8">

      <div className="border-b pb-6">

        <h1 className="text-4xl font-bold">
          MAPA PREMIUM
        </h1>

        <p className="text-gray-400 mt-2">
          Gerado automaticamente pelo AF Framework
        </p>

      </div>

      <NumerologySection
        numerology={map.numerology}
        interpretation={map.interpretation}
      />

    </div>

  )

}