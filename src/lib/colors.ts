/**
 * Une couleur par objectif, par livre, par humeur. Elle porte du sens : on
 * reconnaît un objectif à sa teinte avant même d'avoir lu son nom.
 */

/** Assez foncées ou assez franches pour tenir en pastille pleine. */
export const GOAL_COLORS = [
  "fougere",
  "pivoine",
  "campanule",
  "miel",
  "cerisier",
  "pistache",
  "vin",
] as const;

/** Aplats pâles, pour les couvertures typographiques : l'encre doit rester lisible dessus. */
export const COVER_COLORS = [
  "cerisier",
  "beurre",
  "campanule",
  "pistache",
  "fenouil",
  "pivoine",
  "miel",
  "rose",
] as const;

export function cssColor(token: string): string {
  return `var(--color-${token})`;
}

/** Mélange la teinte au fond crème, pour qu'un texte à l'encre reste lisible par-dessus. */
export function tint(token: string, percent: number): string {
  return `color-mix(in srgb, var(--color-${token}) ${percent}%, var(--color-creme))`;
}

function pick<T>(list: readonly T[], seed: string): T {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return list[hash % list.length];
}

/** Les objectifs créés avant la palette étendue retombent sur un choix stable. */
export function goalColorToken(goal: { id: string; color: string }): string {
  return (GOAL_COLORS as readonly string[]).includes(goal.color)
    ? goal.color
    : pick(GOAL_COLORS, goal.id);
}

export function goalColor(goal: { id: string; color: string }): string {
  return cssColor(goalColorToken(goal));
}

export function coverColorToken(bookId: string): string {
  return pick(COVER_COLORS, bookId);
}
