/** « mardi 28 juillet » */
export function formatDayLong(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatDayTitle(date: Date): string {
  return formatDayLong(date).toUpperCase();
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

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

/** « lun. », « mar. »… */
export function formatWeekdayShort(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(date);
}

/** « 4 – 10 août », ou « 28 juillet – 3 août » à cheval sur deux mois. */
export function formatWeekLabel(monday: Date): string {
  const sunday = addDays(monday, 6);
  const day = new Intl.DateTimeFormat("fr-FR", { day: "numeric" });
  const dayMonth = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" });
  return monday.getMonth() === sunday.getMonth()
    ? `${day.format(monday)} – ${dayMonth.format(sunday)}`
    : `${dayMonth.format(monday)} – ${dayMonth.format(sunday)}`;
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(date);
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
