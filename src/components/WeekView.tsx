import { useStore } from "../lib/use-store";
import { addDays, formatWeekdayShort, isSameDay, startOfWeek, toDateKey } from "../lib/date";
import { EventItem } from "./EventItem";

interface WeekViewProps {
  anchor: Date;
  onPickDay: (date: string) => void;
}

export function WeekView({ anchor, onPickDay }: WeekViewProps) {
  const { eventsFor } = useStore();
  const monday = startOfWeek(anchor);
  const today = new Date();

  return (
    // Sept lignes empilées au téléphone et en portrait, sept colonnes en paysage.
    <div className="grid gap-3 lg:grid-cols-7">
      {Array.from({ length: 7 }, (_, i) => {
        const day = addDays(monday, i);
        const key = toDateKey(day);
        const events = eventsFor(key);
        const isToday = isSameDay(day, today);

        return (
          <section
            key={key}
            className={`min-w-0 rounded-card border p-2 sm:p-3 ${
              isToday ? "border-terre" : "border-ligne"
            }`}
          >
            <button
              type="button"
              onClick={() => onPickDay(key)}
              className="flex w-full items-baseline gap-2 text-left"
            >
              <span className="text-xs text-encre/70">{formatWeekdayShort(day)}</span>
              <span
                className={`flex h-7 min-w-7 items-center justify-center rounded-pill px-1.5 text-sm ${
                  isToday ? "bg-rose text-encre" : "text-encre"
                }`}
              >
                {day.getDate()}
              </span>
            </button>

            {events.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {events.map((event) => (
                  <EventItem key={event.id} event={event} compact />
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-encre/50">—</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
