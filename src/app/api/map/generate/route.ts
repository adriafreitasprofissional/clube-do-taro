import { NextRequest, NextResponse } from "next/server"

import { ClientModel } from "@/models/Client"
import { MapModel } from "@/models/Map"

import { MapEngine } from "@/engine/MapEngine"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const client = new ClientModel(body)

    const map = new MapModel({
      numerology: true,
      astrology: true,
      nominal: true,
      cards: true,

      business: false,
      couple: false,
      baby: false,
      house: false,
      dating: false,
    })

    const result = new MapEngine().execute(client, map)

console.log("MAPA GERADO");

return NextResponse.json(result)

    } catch (error) {

    console.error("ERRO REAL AO GERAR MAPA:", error)

    const message =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao gerar mapa."

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 500,
      }
    )

  }
}