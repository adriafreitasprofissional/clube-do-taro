import { reduce } from "./reduce";
import { kabbalah } from "./kabbalah";
import { normalizeName } from "./normalizeName";

export function calculateExpression(
  name: string
): number {
  const clean = normalizeName(name);

  let total = 0;

  for (const letter of clean) {
    total +=
      kabbalah[
        letter as keyof typeof kabbalah
      ] || 0;
  }

  return reduce(total);
}