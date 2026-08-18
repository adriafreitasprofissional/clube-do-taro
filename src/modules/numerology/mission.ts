import { reduce } from "./reduce"

export function calculateMission(
  lifeLesson: number,
  destiny: number
): number {

  return reduce(
    lifeLesson + destiny
  )

}