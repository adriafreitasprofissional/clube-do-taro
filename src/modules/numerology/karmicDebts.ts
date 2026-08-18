export function calculateKarmicDebts(
  lifeLesson: number,
  destiny: number,
  expression: number
): number[] {

  const debts = new Set<number>()

  const values = [
    lifeLesson,
    destiny,
    expression,
  ]

  for (const value of values) {
    if ([13, 14, 16, 19].includes(value)) {
      debts.add(value)
    }
  }

  return Array.from(debts)
}