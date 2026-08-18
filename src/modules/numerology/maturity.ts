import { reduce } from "./reduce"

export function calculateMaturity(
  destiny: number,
  expression: number
): number {

  return reduce(
    destiny + expression
  )

}