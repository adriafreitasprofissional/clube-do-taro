import { reduce } from "./reduce"

export function calculatePersonalMonth(
  personalYear: number,
  currentMonth: number = new Date().getMonth() + 1
): number {
  return reduce(personalYear + currentMonth)
}