import { calculateExpression } from "./expression";

export function getFirstBirthName(
  fullName: string
): string {
  return fullName
    .trim()
    .split(/\s+/)[0] || "";
}

export function calculateNameVibration(
  fullName: string
): number {
  const firstName =
    getFirstBirthName(fullName);

  if (!firstName) {
    return 0;
  }

  return calculateExpression(
    firstName
  );
}