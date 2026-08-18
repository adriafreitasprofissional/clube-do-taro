import { ClientModel } from "@/models/Client"

import { calculateLifeLesson } from "@/modules/numerology/lifeLesson"
import { calculateDestiny } from "@/modules/numerology/destiny"
import { calculateExpression } from "@/modules/numerology/expression"
import { calculateMotivation } from "@/modules/numerology/motivation"
import { calculateImpression } from "@/modules/numerology/impression"
import { calculateMission } from "@/modules/numerology/mission"
import { calculateMaturity } from "@/modules/numerology/maturity"
import { calculateSoul } from "@/modules/numerology/soul"
import { calculatePersonality } from "@/modules/numerology/personality"
import { calculatePersonalYear } from "@/modules/numerology/personalYear"
import { calculatePersonalMonth } from "@/modules/numerology/personalMonth"
import { calculatePersonalDay } from "@/modules/numerology/personalDay"
import { calculatePinnacles, PinnaclesResult } from "@/modules/numerology/pinnacles"
import { calculateCycles } from "@/modules/numerology/cycles"
import { calculateKarmicDebts } from "@/modules/numerology/karmicDebts"


export interface NumerologyResult {
  success: boolean

  lifeLesson: number
  destiny: number
  expression: number
  motivation: number
  impression: number
  mission: number
  maturity: number
  soul: number
  personality: number
  personalYear: number
  personalMonth: number
  personalDay: number

  pinnacles: {
    first: number
    second: number
    third: number
    fourth: number
  }

  cycles: {
    first: number
    second: number
    third: number
  }

  karmicDebts: number[]
}



export class NumerologyEngine {

  execute(client: ClientModel): NumerologyResult {

    if (!client.hasBirthDate) {
      return {
        success: false,

        lifeLesson: 0,
        destiny: 0,
        expression: 0,
        motivation: 0,
        impression: 0,
        mission: 0,
        maturity: 0,
        soul: 0,
        personality: 0,
        personalYear: 0,
        personalMonth: 0,
        personalDay: 0,
        pinnacles: {
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        },
        cycles: {
        first: 0,
        second: 0,
        third: 0,
        },
      karmicDebts: [],
      }
  
    }

    const birthDate = client.data.dataNascimento!
    const birthDateObj = new Date(birthDate)
    const fullName = client.fullName
    
    const soul = calculateSoul(fullName)
    const personality = calculatePersonality(fullName)
    const lifeLesson = calculateLifeLesson(birthDate)
    const destiny = calculateDestiny(birthDate)
    const expression = calculateExpression(fullName)
    const motivation = calculateMotivation(fullName)
    const impression = calculateImpression(fullName)
    const personalYear = calculatePersonalYear(birthDateObj)
    const personalMonth = calculatePersonalMonth(personalYear)
    const personalDay = calculatePersonalDay(personalMonth)
    const mission = calculateMission(lifeLesson, destiny)
    const maturity = calculateMaturity(destiny, expression)
    
   const pinnacles = calculatePinnacles(
  birthDateObj,
  lifeLesson
)

const cycles = calculateCycles(birthDateObj)
    const karmicDebts = calculateKarmicDebts(lifeLesson, destiny, expression)

    return {
      success: true,

      lifeLesson,
      destiny,
      expression,
      motivation,
      impression,
      mission,
      maturity,
      soul,
      personality,
      personalYear,
      personalMonth,
      personalDay,
      pinnacles,
      cycles,
      karmicDebts,
    }

  }

}