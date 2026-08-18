import { reduce } from "./reduce"

export function calculateDestiny(
  birthDate: string
): number {

  const digits =
    birthDate
      .replace(/-/g, "")
      .split("")
      .map(Number)

  const total =
    digits.reduce(
      (sum, value) => sum + value,
      0
    )

  return reduce(total)

}