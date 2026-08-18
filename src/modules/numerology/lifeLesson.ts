import { reduce } from "./reduce"

export function calculateLifeLesson(
  birthDate: string
): number {

  const [year, month, day] =
    birthDate
      .split("-")
      .map(Number)

  const total =
    reduce(day) +
    reduce(month) +
    reduce(year)

  return reduce(total)

}