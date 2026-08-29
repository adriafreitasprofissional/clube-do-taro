import { reduce } from "./reduce"

export function calculateHiddenTalent(
  motivation: number,
  expression: number
): number {
  return reduce(
    motivation + expression
  )
}


const PYTHAGOREAN: Record<string, number> = {
  A: 1,
  J: 1,
  S: 1,

  B: 2,
  K: 2,
  T: 2,

  C: 3,
  L: 3,
  U: 3,

  D: 4,
  M: 4,
  V: 4,

  E: 5,
  N: 5,
  W: 5,

  F: 6,
  O: 6,
  X: 6,

  G: 7,
  P: 7,
  Y: 7,

  H: 8,
  Q: 8,
  Z: 8,

  I: 9,
  R: 9,
};

export interface HiddenTendencyResult {
  numbers: number[];
  frequency: Record<number, number>;
}

export function calculateHiddenTendency(
  name: string
): HiddenTendencyResult {

  const normalizedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

  const frequency: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  for (const letter of normalizedName) {
    const number = PYTHAGOREAN[letter];

    if (number) {
      frequency[number]++;
    }
  }

  const highestFrequency = Math.max(
    ...Object.values(frequency)
  );

  const numbers = Object.entries(frequency)
    .filter(
      ([, count]) =>
        count === highestFrequency &&
        count > 0
    )
    .map(([number]) => Number(number));

  return {
    numbers,
    frequency,
  };
}