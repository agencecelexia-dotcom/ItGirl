import { useStore } from "../lib/use-store";
import { addDays, toDateKey } from "../lib/date";

const COUNT_WORDS = ["", "une", "deux", "trois", "quatre", "cinq", "six"];

function sentence(count: number): string {
  const word = COUNT_WORDS[count] ?? String(count);
  return count === 1
    ? "Hier, une chose est restée en plan."
    : `Hier, ${word} choses sont restées en plan.`;
}

export function YesterdayReminder() {
  const { tasksFor, repeatTaskToday } = useStore();
  const leftovers = tasksFor(toDateKey(addDays(new Date(), -1))).filter((t) => !t.done);

  if (leftovers.length === 0) return null;

  return (
    <section className="rounded-card border border-ligne p-5">
      <p className="text-small text-encre/70">{sentence(leftovers.length)}</p>
      <ul className="mt-3 space-y-2">
        {leftovers.map((task) => (
          <li key={task.id} className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-body">{task.text}</span>
            <button
              type="button"
              onClick={() => repeatTaskToday(task.id)}
              className="rounded-pill border border-ligne px-3 py-1.5 text-micro text-encre/70 transition-colors hover:border-terre"
            >
              Reprendre aujourd'hui
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
