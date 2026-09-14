import { reduce } from "./reduce";
import { kabbalah } from "./kabbalah";
import { normalizeName } from "./normalizeName";

const vowels = new Set([
  "A",
  "E",
  "I",
  "O",
  "U",
]);

export function calculateMotivation(
  name: string
): number {
  const clean =
    normalizeName(name);

  let total = 0;

  for (const letter of clean) {
    if (vowels.has(letter)) {
      total +=
        kabbalah[
          letter as keyof typeof kabbalah
        ] || 0;
    }
  }

  return reduce(total);
}