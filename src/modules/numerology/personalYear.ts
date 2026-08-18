import { reduce } from "./reduce"

export function calculatePersonalYear(
  birthDate: Date,
  currentYear: number = new Date().getFullYear()
): number {

  const day = birthDate.getDate()
  const month = birthDate.getMonth() + 1

  const yearSum = currentYear
    .toString()
    .split("")
    .reduce((total, digit) => total + Number(digit), 0)

  return reduce(day + month + yearSum)
}