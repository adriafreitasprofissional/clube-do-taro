export function reduce(value: number): number {

  while (
    value > 9 &&
    value !== 11 &&
    value !== 22 &&
    value !== 33
  ) {

    value = value
      .toString()
      .split("")
      .reduce(
        (sum, n) => sum + Number(n),
        0
      )

  }

  return value

}