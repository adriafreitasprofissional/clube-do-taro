import { ClientModel } from "@/models/Client"

export interface AstrologyResult {
  success: boolean

  sun: string
  moon: string
  ascendant: string

  message?: string
}

export class AstrologyEngine {

  execute(client: ClientModel): AstrologyResult {

    if (!client.hasAstrologyData) {
      return {
        success: false,

        sun: "",
        moon: "",
        ascendant: "",

        message: "Dados insuficientes para gerar o mapa."
      }
    }

    // Amanhã ligaremos ao motor astrológico.
    // Hoje vamos deixar a estrutura pronta.

    return {
      success: true,

      sun: "A calcular",
      moon: "A calcular",
      ascendant: "A calcular",
    }

  }

}