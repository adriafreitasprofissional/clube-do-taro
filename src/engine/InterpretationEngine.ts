import { NumerologyResult } from "./NumerologyEngine"
import { NominalResult } from "./NominalEngine"
import { AstrologyResult } from "./AstrologyEngine"
import { CardsResult } from "./CardsEngine"

import { buildChapter } from "@/modules/interpreter/buildChapter"
import { LIFE_LESSON } from "@/modules/interpreter/lifeLesson"
import { DESTINY } from "@/modules/interpreter/destiny"
import { EXPRESSION } from "@/modules/interpreter/expression"
import { MOTIVATION } from "@/modules/interpreter/motivation"
import { IMPRESSION } from "@/modules/interpreter/impression"

import { MISSION } from "@/modules/interpreter/mission"
import { MATURITY } from "@/modules/interpreter/maturity"
import { SOUL } from "@/modules/interpreter/soul"
import { PERSONALITY } from "@/modules/interpreter/personality"

import { PERSONAL_YEAR } from "@/modules/interpreter/personalYear"
import { PERSONAL_MONTH } from "@/modules/interpreter/personalMonth"
import { PERSONAL_DAY } from "@/modules/interpreter/personalDay"

import { PINNACLES } from "@/modules/interpreter/pinnacles"
import { CYCLES } from "@/modules/interpreter/cycles"
import { KARMIC_DEBTS } from "@/modules/interpreter/karmicDebts"

export interface InterpretationChapter {
  id: string
  title: string
  content: string
}

export interface InterpretationResult {
  chapters: InterpretationChapter[]
}

export class InterpretationEngine {

  execute(
    numerology: NumerologyResult,
    nominal: NominalResult,
    astrology: AstrologyResult,
    cards: CardsResult
  ): InterpretationResult {

    const chapters: InterpretationChapter[] = []

    const lifeLesson =
      LIFE_LESSON[numerology.lifeLesson] ?? {
        title: `Lição de Vida ${numerology.lifeLesson}`,
        intro: `Seu Número da Lição de Vida é ${numerology.lifeLesson}.`,
        meaning: "",
        gifts: "",
        challenges: "",
        mission: "",
        advice: ""
      }

    const destiny =
      DESTINY[numerology.destiny] ?? {
        title: `Destino ${numerology.destiny}`,
        intro: `Seu Número de Destino é ${numerology.destiny}.`,
        meaning: "",
        gifts: "",
        challenges: "",
        mission: "",
        advice: ""
      }

   chapters.push({
  id: "lifeLesson",
  title: lifeLesson.title,
  content: buildChapter(lifeLesson)
})

chapters.push({
  id: "destiny",
  title: destiny.title,
  content: buildChapter(destiny)
})
    
    const expression =
  EXPRESSION[nominal.expression]

const motivation =
  MOTIVATION[nominal.motivation]

const impression =
  IMPRESSION[nominal.impression]

const mission =
  MISSION[numerology.mission]

const maturity =
  MATURITY[numerology.maturity]

const soul =
  SOUL[numerology.soul]

const personality =
  PERSONALITY[numerology.personality]

const personalYear =
  PERSONAL_YEAR[numerology.personalYear]

const personalMonth =
  PERSONAL_MONTH[numerology.personalMonth]

const personalDay =
  PERSONAL_DAY[numerology.personalDay]

console.log("NUMEROLOGY", JSON.stringify(numerology, null, 2))

const firstCycle =
  CYCLES[numerology.cycles.first]

const secondCycle =
  CYCLES[numerology.cycles.second]

const thirdCycle =
  CYCLES[numerology.cycles.third]

const firstPinnacle =
  PINNACLES[numerology.pinnacles.first]

const secondPinnacle =
  PINNACLES[numerology.pinnacles.second]

const thirdPinnacle =
  PINNACLES[numerology.pinnacles.third]

const fourthPinnacle =
  PINNACLES[numerology.pinnacles.fourth]



chapters.push({
  id: "expression",
  title: expression.title,
  content: buildChapter(expression)
})

chapters.push({
  id: "motivation",
  title: motivation.title,
  content: buildChapter(motivation)
})

chapters.push({
  id: "impression",
  title: impression.title,
  content: buildChapter(impression)
})

chapters.push({
  id: "mission",
  title: mission.title,
  content: buildChapter(mission)
})

chapters.push({
  id: "maturity",
  title: maturity.title,
  content: buildChapter(maturity)
})

chapters.push({
  id: "soul",
  title: soul.title,
  content: buildChapter(soul)
})

chapters.push({
  id: "personality",
  title: personality.title,
  content: buildChapter(personality)
})

chapters.push({
  id: "personalYear",
  title: personalYear.title,
  content: buildChapter(personalYear)
})

chapters.push({
  id: "personalMonth",
  title: personalMonth.title,
  content: buildChapter(personalMonth)
})

chapters.push({
  id: "personalDay",
  title: personalDay.title,
  content: buildChapter(personalDay)
})

chapters.push({
  id: "cycle1",
  title: `1º ${firstCycle.title}`,
  content: buildChapter(firstCycle)
})

chapters.push({
  id: "cycle2",
  title: `2º ${secondCycle.title}`,
  content: buildChapter(secondCycle)
})

chapters.push({
  id: "cycle3",
  title: `3º ${thirdCycle.title}`,
  content: buildChapter(thirdCycle)
})

chapters.push({
  id: "pinnacle1",
  title: `1º ${firstPinnacle.title}`,
  content: buildChapter(firstPinnacle)
})

chapters.push({
  id: "pinnacle2",
  title: `2º ${secondPinnacle.title}`,
  content: buildChapter(secondPinnacle)
})

chapters.push({
  id: "pinnacle3",
  title: `3º ${thirdPinnacle.title}`,
  content: buildChapter(thirdPinnacle)
})

chapters.push({
  id: "pinnacle4",
  title: `4º ${fourthPinnacle.title}`,
  content: buildChapter(fourthPinnacle)
})

for (const debt of numerology.karmicDebts) {
  const interpretation = KARMIC_DEBTS[debt]

  if (!interpretation) continue

  chapters.push({
    id: `debt-${debt}`,
    title: interpretation.title,
    content: buildChapter(interpretation)
  })
}
    return {
      chapters
    }

  }

}