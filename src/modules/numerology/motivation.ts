import { reduce } from "./reduce"
import { kabbalah } from "./kabbalah"

const vowels = ["A", "E", "I", "O", "U"]

export function calculateMotivation(
  name: string
): number {

  const clean = name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")

  let total = 0

  for (const letter of clean) {
    if (vowels.includes(letter)) {
      total +=
        kabbalah[
          letter as keyof typeof kabbalah
        ] || 0
    }
  }

  return reduce(total)

}