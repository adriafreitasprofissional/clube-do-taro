import { ClientModel } from "@/models/Client"
import { MapModel } from "@/models/Map"

import { ValidationEngine } from "./ValidationEngine"
import { NumerologyEngine } from "./NumerologyEngine"
import { AstrologyEngine } from "./AstrologyEngine"
import { NominalEngine } from "./NominalEngine"
import { CardsEngine } from "./CardsEngine"
import { InterpretationEngine } from "./InterpretationEngine"

import { MapResult } from "@/types/results"

export class MapEngine {

  execute(
    client: ClientModel,
    map: MapModel
  ): MapResult {

    new ValidationEngine().execute(client)

    const result: MapResult = {
      generatedAt: new Date(),
    }

    if (map.hasNumerology) {
      result.numerology = new NumerologyEngine().execute(client)
    }

    if (map.hasNominal) {
      result.nominal = new NominalEngine().execute(client)
    }

    if (map.hasAstrology) {
      result.astrology = new AstrologyEngine().execute(client)
    }

    if (map.hasCards) {
      result.cards = new CardsEngine().execute()
    }

    result.interpretation = new InterpretationEngine().execute(
      result.numerology!,
      result.nominal!,
      result.astrology!,
      result.cards!
    )

    return result

  }

}