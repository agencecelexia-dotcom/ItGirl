import { useStore } from "../lib/use-store";
import { toDateKey } from "../lib/date";
import { EventItem } from "./EventItem";

/** La barre de navigation nomme déjà le jour : inutile de le répéter ici. */
export function DayView({ anchor }: { anchor: Date }) {
  const { eventsFor } = useStore();
  const events = eventsFor(toDateKey(anchor));

  return (
    <section className="rounded-card border border-ligne p-5">
      {events.length > 0 ? (
        <ul className="space-y-2">
          {events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </ul>
      ) : (
        <p className="text-small text-encre/70">Rien de prévu ce jour-là.</p>
      )}
    </section>
  );
}
