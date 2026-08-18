import { reduce } from "./reduce"
import { kabbalah } from "./kabbalah"

export function calculateExpression(
  name: string
): number {

  const clean =
    name
      .toUpperCase()
      .replace(/[^A-Z]/g, "")

  let total = 0

  for (const letter of clean) {
    total +=
      kabbalah[
        letter as keyof typeof kabbalah
      ] || 0
  }

  return reduce(total)

}