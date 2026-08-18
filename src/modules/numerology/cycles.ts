import { reduce } from "./reduce"

export interface CyclesResult {
  first: number
  second: number
  third: number
}

export function calculateCycles(
  birthDate: Date
): CyclesResult {

  const month = reduce(birthDate.getMonth() + 1)

  const day = reduce(birthDate.getDate())

  const year = reduce(
    birthDate
      .getFullYear()
      .toString()
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0)
  )

  return {
    first: month,
    second: day,
    third: year,
  }
}