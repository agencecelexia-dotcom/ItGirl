import { useState } from "react";
import { DayView } from "../components/DayView";
import { WeekView } from "../components/WeekView";
import { MonthView } from "../components/MonthView";
import { AddEventForm } from "../components/AddEventForm";
import {
  addDays,
  formatDayTitle,
  formatMonthYear,
  formatWeekLabel,
  isWeekend,
  startOfWeek,
  toDateKey,
} from "../lib/date";

type View = "jour" | "semaine" | "mois";

const VIEWS: { id: View; label: string }[] = [
  { id: "jour", label: "Jour" },
  { id: "semaine", label: "Semaine" },
  { id: "mois", label: "Mois" },
];

/** Elle remplit son planning le week-end : dans ce cas, on ouvre déjà sur la semaine qui arrive. */
function initialAnchor(): Date {
  const today = new Date();
  return isWeekend(today) ? addDays(startOfWeek(today), 7) : today;
}

export function EmploiDuTemps() {
  const [view, setView] = useState<View>("semaine");
  const [anchor, setAnchor] = useState(initialAnchor);
  // Le formulaire part d'aujourd'hui ; toucher un jour dans la semaine ou le mois le repositionne.
  const [formDate, setFormDate] = useState(() => toDateKey(new Date()));

  const shift = (direction: 1 | -1) => {
    if (view === "jour") return setAnchor((d) => addDays(d, direction));
    if (view === "semaine") return setAnchor((d) => addDays(d, direction * 7));
    setAnchor((d) => new Date(d.getFullYear(), d.getMonth() + direction, 1));
  };

  const pickDay = (date: string) => {
    setFormDate(date);
    setAnchor(new Date(`${date}T12:00:00`));
    setView("jour");
  };

  const label =
    view === "jour"
      ? formatDayTitle(anchor)
      : view === "semaine"
        ? formatWeekLabel(startOfWeek(anchor))
        : formatMonthYear(anchor);

  return (
    <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 sm:py-8">
      <h1 className="font-display uppercase text-vin text-h1">
        Emploi du temps
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {VIEWS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              // « Jour » veut dire aujourd'hui : le décalage du week-end ne concerne que la semaine.
              if (item.id === "jour") setAnchor(new Date());
              setView(item.id);
            }}
            aria-pressed={view === item.id}
            className={`min-h-11 rounded-pill border px-4 text-small transition-colors ${
              view === item.id ? "border-terre text-encre" : "border-ligne text-encre/70"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label="Précédent"
          className="h-11 w-11 rounded-pill border border-ligne text-encre"
        >
          ‹
        </button>
        <p className="min-w-0 flex-1 text-center text-small text-encre/70 first-letter:uppercase">
          {label}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="Suivant"
          className="h-11 w-11 rounded-pill border border-ligne text-encre"
        >
          ›
        </button>
      </div>

      <div className="mt-2 flex justify-center">
        <button
          type="button"
          onClick={() => setAnchor(new Date())}
          className="rounded-pill px-3 py-1.5 text-micro text-encre/70 underline underline-offset-4"
        >
          Revenir à aujourd'hui
        </button>
      </div>

      <div className="mt-5">
        {view === "jour" && <DayView anchor={anchor} />}
        {view === "semaine" && <WeekView anchor={anchor} onPickDay={pickDay} />}
        {view === "mois" && <MonthView anchor={anchor} onPickDay={pickDay} />}
      </div>

      <div className="mt-4">
        <AddEventForm date={formDate} onDateChange={setFormDate} />
      </div>
    </div>
  );
}
