import { useStore } from "../lib/use-store";
import { toDateKey } from "../lib/date";
import { cssColor, tint } from "../lib/colors";

/** Chaque humeur a sa teinte : on la reconnaît avant de lire le mot. */
const MOODS = [
  { word: "légère", color: "campanule" },
  { word: "calme", color: "fougere" },
  { word: "pleine", color: "miel" },
  { word: "fatiguée", color: "pistache" },
  { word: "fière", color: "pivoine" },
];

export function EveningCheckIn() {
  const { entryFor, updateEntry } = useStore();
  const date = toDateKey(new Date());
  const entry = entryFor(date);

  return (
    <section className="rounded-card border border-ligne p-5">
      <h2 className="font-display uppercase text-h2">Le point du soir</h2>
      <p className="mt-1 text-small text-encre/70">Si tu en as envie.</p>

      <fieldset className="mt-4">
        <legend className="text-micro text-encre/70">Comment tu te sens</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {MOODS.map(({ word, color }) => {
            const selected = entry?.mood === word;
            return (
              <button
                key={word}
                type="button"
                onClick={() => updateEntry(date, { mood: selected ? undefined : word })}
                aria-pressed={selected}
                className={`min-h-11 rounded-pill border px-4 py-2 text-small transition-colors ${
                  selected ? "text-encre" : "border-ligne text-encre/70"
                }`}
                style={
                  selected
                    ? { borderColor: cssColor(color), backgroundColor: tint(color, 45) }
                    : undefined
                }
              >
                {word}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4">
        <label htmlFor="mot-du-jour" className="text-micro text-encre/70">
          Le mot du jour
        </label>
        <input
          id="mot-du-jour"
          value={entry?.word ?? ""}
          onChange={(e) => updateEntry(date, { word: e.target.value })}
          placeholder="un mot qui résume la journée"
          className="mt-1 w-full border-b border-ligne bg-transparent py-2 font-script text-script text-rose placeholder:font-sans placeholder:text-small placeholder:text-encre/50 focus:outline-none focus:border-terre"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="ce-qui-a-marche" className="text-micro text-encre/70">
          Ce qui a marché aujourd'hui
        </label>
        <textarea
          id="ce-qui-a-marche"
          value={entry?.text ?? ""}
          onChange={(e) => updateEntry(date, { text: e.target.value })}
          rows={3}
          className="mt-1 w-full resize-none rounded-card border border-ligne bg-transparent p-3 text-body leading-relaxed focus:outline-none focus:border-terre"
        />
      </div>
    </section>
  );
}
