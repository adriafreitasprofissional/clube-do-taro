import { reduce } from "./reduce"

function getVowelValue(letter: string): number {
  switch (letter.toUpperCase()) {
    case "A":
    case "Á":
    case "À":
    case "Ã":
    case "Â":
      return 1

    case "E":
    case "É":
    case "Ê":
      return 5

    case "I":
    case "Í":
      return 9

    case "O":
    case "Ó":
    case "Õ":
    case "Ô":
      return 6

    case "U":
    case "Ú":
      return 3

    default:
      return 0
  }
}

export function calculateSoul(fullName: string): number {
  let total = 0

  for (const letter of fullName) {
    total += getVowelValue(letter)
  }

  return reduce(total)
}