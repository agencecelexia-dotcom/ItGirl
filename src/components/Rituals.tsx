import { useState } from "react";
import { useStore } from "../lib/use-store";
import { toDateKey } from "../lib/date";

export function Rituals() {
  const { habits, isHabitDone, toggleHabit, addHabit, removeHabit } = useStore();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState("");
  const date = toDateKey(new Date());

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    addHabit(label);
    setLabel("");
  };

  return (
    <section className="rounded-card border border-ligne p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display uppercase tracking-[0.03em] text-lg">Rituels</h2>
        <button
          type="button"
          onClick={() => setEditing((e) => !e)}
          className="rounded-pill border border-ligne px-3 py-1.5 text-xs text-encre/70 transition-colors hover:border-terre"
        >
          {editing ? "Terminé" : "Modifier"}
        </button>
      </div>

      {habits.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {habits.map((habit) => {
            const done = isHabitDone(habit.id, date);
            return (
              <li key={habit.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => toggleHabit(habit.id, date)}
                  aria-pressed={done}
                  className={`min-h-11 rounded-pill border px-4 py-2 text-sm transition-colors ${
                    done ? "border-rose bg-rose/40 text-encre" : "border-ligne text-encre/70"
                  }`}
                >
                  {habit.label}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={() => removeHabit(habit.id)}
                    aria-label={`Supprimer le rituel ${habit.label}`}
                    className="flex h-11 w-9 items-center justify-center text-encre/70"
                  >
                    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden="true">
                      <path
                        d="M3 3 L11 11 M11 3 L3 11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-encre/70">
          Aucun rituel pour l'instant. Ajoute ce qui te fait du bien.
        </p>
      )}

      {editing && (
        <form onSubmit={submit} className="mt-4 flex items-center gap-2 border-t border-ligne pt-4">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Nouveau rituel"
            aria-label="Nouveau rituel"
            className="min-w-0 flex-1 bg-transparent py-2 text-[15px] placeholder:text-encre/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!label.trim()}
            className="rounded-pill border border-terre px-4 py-2 text-xs text-encre transition-opacity disabled:opacity-40"
          >
            Ajouter
          </button>
        </form>
      )}
    </section>
  );
}
