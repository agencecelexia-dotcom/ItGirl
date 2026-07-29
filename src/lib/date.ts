export function formatDayTitle(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
    .format(date)
    .toUpperCase();
}

/** Clé locale YYYY-MM-DD — jamais toISOString, qui décalerait le jour selon le fuseau. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

/** La semaine commence le lundi. */
export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return d;
}

export function weekRange(date: Date): [string, string] {
  const start = startOfWeek(date);
  return [toDateKey(start), toDateKey(addDays(start, 6))];
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(date);
}

/** Les lundis de chaque semaine touchant le mois de `date`. */
export function weeksOfMonth(date: Date): Date[] {
  const last = new Date(date.getFullYear(), date.getMonth(), daysInMonth(date));
  const weeks: Date[] = [];
  for (let d = startOfWeek(startOfMonth(date)); d <= last; d = addDays(d, 7)) {
    weeks.push(d);
  }
  return weeks;
}
