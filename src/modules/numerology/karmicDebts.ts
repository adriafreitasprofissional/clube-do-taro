import { reduce } from "./reduce"
import { kabbalah } from "./kabbalah"

const KARMIC_NUMBERS = [13, 14, 16, 19]

function findKarmicDebt(
  value: number,
  debts: Set<number>
) {
  let current = value

  while (
    current > 9 &&
    current !== 11 &&
    current !== 22 &&
    current !== 33
  ) {
    if (KARMIC_NUMBERS.includes(current)) {
      debts.add(current)
    }

    current = current
      .toString()
      .split("")
      .reduce(
        (sum, digit) => sum + Number(digit),
        0
      )
  }

  if (KARMIC_NUMBERS.includes(current)) {
    debts.add(current)
  }
}

export function calculateKarmicDebts(
  birthDate: string,
  name: string
): number[] {

  const debts = new Set<number>()

  // Lição de Vida
  const [year, month, day] =
    birthDate
      .split("-")
      .map(Number)

  const lifeLessonTotal =
    reduce(day) +
    reduce(month) +
    reduce(year)

  findKarmicDebt(
    lifeLessonTotal,
    debts
  )

  // Destino
  const destinyTotal =
    birthDate
      .replace(/-/g, "")
      .split("")
      .map(Number)
      .reduce(
        (sum, value) => sum + value,
        0
      )

  findKarmicDebt(
    destinyTotal,
    debts
  )

  // Expressão
  const cleanName =
    name
      .toUpperCase()
      .replace(/[^A-Z]/g, "")

  let expressionTotal = 0

  for (const letter of cleanName) {
    expressionTotal +=
      kabbalah[
        letter as keyof typeof kabbalah
      ] || 0
  }

  findKarmicDebt(
    expressionTotal,
    debts
  )

  return Array.from(debts)
}