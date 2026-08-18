import { InterpretationData } from "./types"

export function buildChapter(
  data: InterpretationData
): string {

  return `
${data.intro}

${data.meaning}

Dons

${data.gifts}

Desafios

${data.challenges}

Missão

${data.mission}

Conselho

${data.advice}
`.trim()

}