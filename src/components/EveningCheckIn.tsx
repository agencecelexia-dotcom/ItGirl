import { useStore } from "../lib/use-store";
import { toDateKey } from "../lib/date";

const MOODS = ["légère", "calme", "pleine", "fatiguée", "fière"];

export function EveningCheckIn() {
  const { entryFor, updateEntry } = useStore();
  const date = toDateKey(new Date());
  const entry = entryFor(date);

  return (
    <section className="rounded-card border border-ligne p-5">
      <h2 className="font-display uppercase tracking-[0.03em] text-lg">Le point du soir</h2>
      <p className="mt-1 text-sm text-encre/70">Si tu en as envie.</p>

      <fieldset className="mt-4">
        <legend className="text-xs text-encre/70">Comment tu te sens</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {MOODS.map((mood) => {
            const selected = entry?.mood === mood;
            return (
              <button
                key={mood}
                type="button"
                onClick={() => updateEntry(date, { mood: selected ? undefined : mood })}
                aria-pressed={selected}
                className={`min-h-11 rounded-pill border px-4 py-2 text-sm transition-colors ${
                  selected ? "border-rose bg-rose/40 text-encre" : "border-ligne text-encre/70"
                }`}
              >
                {mood}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4">
        <label htmlFor="mot-du-jour" className="text-xs text-encre/70">
          Le mot du jour
        </label>
        <input
          id="mot-du-jour"
          value={entry?.word ?? ""}
          onChange={(e) => updateEntry(date, { word: e.target.value })}
          placeholder="un mot qui résume la journée"
          className="mt-1 w-full border-b border-ligne bg-transparent py-2 font-script text-2xl text-rose placeholder:font-sans placeholder:text-sm placeholder:text-encre/50 focus:outline-none focus:border-terre"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="ce-qui-a-marche" className="text-xs text-encre/70">
          Ce qui a marché aujourd'hui
        </label>
        <textarea
          id="ce-qui-a-marche"
          value={entry?.text ?? ""}
          onChange={(e) => updateEntry(date, { text: e.target.value })}
          rows={3}
          className="mt-1 w-full resize-none rounded-card border border-ligne bg-transparent p-3 text-[15px] leading-relaxed focus:outline-none focus:border-terre"
        />
      </div>
    </section>
  );
}
