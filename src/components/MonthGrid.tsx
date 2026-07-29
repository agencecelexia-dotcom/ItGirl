import { useStore } from "../lib/use-store";
import { daysInMonth, formatMonth, startOfMonth, startOfWeek, toDateKey } from "../lib/date";
import { goalColor } from "../lib/colors";

const GAP = 18;
const RADIUS = 5;
const COLS = 7;

/** Plus il y a d'objectifs touchés ce jour-là, plus la pastille est franche. */
function opacityFor(goals: number): number {
  if (goals >= 3) return 1;
  if (goals === 2) return 0.75;
  return 0.5;
}

export function MonthGrid() {
  const { goalLogs, goals } = useStore();
  const today = new Date();
  const first = startOfMonth(today);
  const total = daysInMonth(today);

  // Décalage pour aligner le 1er du mois sur son jour de semaine, lundi en tête.
  const offset = Math.round((first.getTime() - startOfWeek(first).getTime()) / 86_400_000);
  const rows = Math.ceil((offset + total) / COLS);

  const byDay = new Map<string, Set<string>>();
  for (const log of goalLogs) {
    const set = byDay.get(log.date) ?? new Set<string>();
    set.add(log.goal_id);
    byDay.set(log.date, set);
  }

  return (
    <section>
      <h3 className="font-display uppercase tracking-[0.03em] text-sm text-encre/70">
        Le mois jour par jour
      </h3>
      <svg
        viewBox={`0 0 ${COLS * GAP} ${rows * GAP}`}
        className="mt-3 w-full max-w-[220px]"
        role="img"
        aria-label={`Les jours de ${formatMonth(today)} où tu as avancé sur un objectif.`}
      >
        {Array.from({ length: total }, (_, i) => {
          const slot = offset + i;
          const date = new Date(first.getFullYear(), first.getMonth(), i + 1);
          const touched = byDay.get(toDateKey(date));
          // La pastille prend la teinte du premier objectif touché ce jour-là.
          const lead = goals.find((goal) => touched?.has(goal.id));
          const count = touched?.size ?? 0;

          return (
            <circle
              key={i}
              cx={(slot % COLS) * GAP + GAP / 2}
              cy={Math.floor(slot / COLS) * GAP + GAP / 2}
              r={RADIUS}
              fill={lead ? goalColor(lead) : "none"}
              fillOpacity={lead ? opacityFor(count) : 0}
              stroke={lead ? "none" : "var(--color-ligne)"}
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </section>
  );
}
