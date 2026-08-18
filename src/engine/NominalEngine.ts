import { ClientModel } from "@/models/Client"

import { calculateExpression } from "@/modules/numerology/expression"
import { calculateMotivation } from "@/modules/numerology/motivation"
import { calculateImpression } from "@/modules/numerology/impression"

export interface NominalResult {
  success: boolean

  expression: number
  motivation: number
  impression: number
  signature: number

  message?: string
}

export class NominalEngine {

  execute(client: ClientModel): NominalResult {

    if (!client.hasNominalData) {
      return {
        success: false,

        expression: 0,
        motivation: 0,
        impression: 0,
        signature: 0,

        message: "Nome não informado."
      }
    }

    const name = client.fullName

    const expression = calculateExpression(name)
    const motivation = calculateMotivation(name)
    const impression = calculateImpression(name)

    return {
      success: true,

      expression,
      motivation,
      impression,

      // depois criaremos o módulo signature.ts
      signature: expression
    }

  }

}