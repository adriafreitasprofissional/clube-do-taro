import { AstrologyResult } from "@/engine/AstrologyEngine"
import { CardsResult } from "@/engine/CardsEngine"
import { InterpretationResult } from "@/engine/InterpretationEngine"
import { NominalResult } from "@/engine/NominalEngine"
import { NumerologyResult } from "@/engine/NumerologyEngine"

export interface MapResult {
  numerology?: NumerologyResult
  nominal?: NominalResult
  astrology?: AstrologyResult
  cards?: CardsResult
  interpretation?: InterpretationResult

  generatedAt: Date
}