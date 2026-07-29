import { useRef, useState } from "react";
import { useStore } from "../lib/use-store";
import type { Event } from "../lib/types";

interface EventItemProps {
  event: Event;
  /** En vue semaine les colonnes sont étroites : on resserre et on ne garde que l'heure de début. */
  compact?: boolean;
}

export function EventItem({ event, compact }: EventItemProps) {
  const { deleteEvent } = useStore();
  const [armed, setArmed] = useState(false);
  const timer = useRef<number>();

  // Le survol révèle la suppression sur un écran à pointeur, l'appui long au doigt.
  const startPress = () => {
    timer.current = window.setTimeout(() => setArmed(true), 500);
  };
  const cancelPress = () => {
    if (timer.current) window.clearTimeout(timer.current);
  };

  const time =
    event.start_time && !compact && event.end_time
      ? `${event.start_time} – ${event.end_time}`
      : event.start_time;

  return (
    <li
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={() => {
        cancelPress();
        setArmed(false);
      }}
      onPointerCancel={cancelPress}
      className={`group relative rounded-card border border-ligne ${
        compact ? "px-2 py-1.5" : "px-3 py-2"
      }`}
    >
      {time && (
        <p className={`text-encre/70 tabular-nums ${compact ? "text-[11px]" : "text-xs"}`}>
          {time}
        </p>
      )}
      <p className={`hyphens-auto ${compact ? "text-[13px] leading-snug" : "text-sm"}`}>
        {event.title}
      </p>

      <button
        type="button"
        onClick={() => deleteEvent(event.id)}
        aria-label={`Supprimer ${event.title}`}
        className={`absolute right-0.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-pill bg-creme text-encre/70 transition-opacity focus-visible:opacity-100 [@media(hover:hover)]:group-hover:opacity-100 ${
          armed ? "opacity-100" : "opacity-0"
        }`}
      >
        <svg viewBox="0 0 14 14" className="h-3 w-3" aria-hidden="true">
          <path
            d="M3 3 L11 11 M11 3 L3 11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  );
}
