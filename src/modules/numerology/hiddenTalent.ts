import { reduce } from "./reduce"

export function calculateHiddenTalent(
  motivation: number,
  expression: number
): number {
  return reduce(
    motivation + expression
  )
}