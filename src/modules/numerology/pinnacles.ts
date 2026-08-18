import { reduce } from "./reduce"

export interface PinnaclesResult {
  first: number
  second: number
  third: number
  fourth: number
}

export function calculatePinnacles(
  birthDate: Date,
  lifeLesson: number
): PinnaclesResult {

  const month = reduce(birthDate.getMonth() + 1)
  const day = reduce(birthDate.getDate())

  const year = reduce(
    birthDate
      .getFullYear()
      .toString()
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0)
  )

  const first = reduce(month + day)
  const second = reduce(day + year)
  const third = reduce(first + second)
  const fourth = reduce(month + year)

  return {
    first,
    second,
    third,
    fourth,
  }
}