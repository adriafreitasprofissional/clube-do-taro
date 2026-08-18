import { reduce } from "./reduce"

export function calculatePersonalDay(
  personalMonth: number,
  currentDay: number = new Date().getDate()
): number {
  return reduce(personalMonth + currentDay)
}