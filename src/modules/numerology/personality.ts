import { reduce } from "./reduce"

function getConsonantValue(letter: string): number {
  switch (letter.toUpperCase()) {
    case "B":
    case "K":
    case "T":
      return 2

    case "C":
    case "G":
    case "L":
    case "S":
      return 3

    case "D":
    case "M":
    case "V":
      return 4

    case "N":
    case "W":
      return 5

    case "F":
    case "X":
      return 6

    case "P":
    case "Y":
      return 7

    case "H":
    case "Q":
    case "Z":
      return 8

    case "J":
    case "R":
      return 9

    default:
      return 0
  }
}

export function calculatePersonality(fullName: string): number {
  let total = 0

  for (const letter of fullName) {
    total += getConsonantValue(letter)
  }

  return reduce(total)
}