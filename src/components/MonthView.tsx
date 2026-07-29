import { useStore } from "../lib/use-store";
import {
  addDays,
  daysInMonth,
  formatWeekdayShort,
  isSameDay,
  startOfMonth,
  startOfWeek,
  toDateKey,
} from "../lib/date";
import { goalColor } from "../lib/colors";

interface MonthViewProps {
  anchor: Date;
  onPickDay: (date: string) => void;
}

export function MonthView({ anchor, onPickDay }: MonthViewProps) {
  const { eventsFor, goalsDoneOn, goals: allGoals } = useStore();
  const first = startOfMonth(anchor);
  const total = daysInMonth(anchor);
  const today = new Date();

  const offset = Math.round((first.getTime() - startOfWeek(first).getTime()) / 86_400_000);
  const headers = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(first), i));

  return (
    <div className="rounded-card border border-ligne p-3 sm:p-5">
      <div className="grid grid-cols-7 gap-1">
        {headers.map((day) => (
          <div key={day.getDay()} className="pb-1 text-center text-[11px] text-encre/70">
            {formatWeekdayShort(day)}
          </div>
        ))}

        {Array.from({ length: offset }, (_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {Array.from({ length: total }, (_, i) => {
          const day = new Date(first.getFullYear(), first.getMonth(), i + 1);
          const key = toDateKey(day);
          const isToday = isSameDay(day, today);
          const hasEvents = eventsFor(key).length > 0;
          const goals = goalsDoneOn(key);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onPickDay(key)}
              className={`flex min-h-14 flex-col items-center gap-1 rounded-card border p-1.5 transition-colors ${
                isToday ? "border-terre" : "border-transparent hover:border-ligne"
              }`}
            >
              <span
                className={`flex h-6 min-w-6 items-center justify-center rounded-pill px-1 text-xs ${
                  isToday ? "bg-rose text-encre" : "text-encre"
                }`}
              >
                {day.getDate()}
              </span>

              <span className="flex flex-wrap items-center justify-center gap-0.5">
                {hasEvents && (
                  <span className="h-1.5 w-1.5 rounded-pill bg-terre" aria-hidden="true" />
                )}
                {goals.slice(0, 3).map((goalId) => {
                  const goal = allGoals.find((g) => g.id === goalId);
                  return (
                    <span
                      key={goalId}
                      className="h-1.5 w-1.5 rounded-pill"
                      style={{ backgroundColor: goal ? goalColor(goal) : "var(--color-rose)" }}
                      aria-hidden="true"
                    />
                  );
                })}
              </span>

              <span className="sr-only">
                {hasEvents ? "Des rendez-vous." : "Rien de prévu."}
                {goals.length > 0 && ` ${goals.length} objectif(s) avancé(s).`}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ligne pt-3 text-xs text-encre/70">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-pill bg-terre" aria-hidden="true" />
          un rendez-vous
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-pill bg-rose" aria-hidden="true" />
          un objectif avancé
        </span>
      </p>
    </div>
  );
}
