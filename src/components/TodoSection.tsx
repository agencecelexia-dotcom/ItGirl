import { useState } from "react";
import { useStore } from "../lib/use-store";
import { addDays, toDateKey } from "../lib/date";
import { TaskRow } from "./TaskRow";
import { GoalPicker } from "./GoalPicker";

export function TodoSection() {
  const { tasksFor, addTask } = useStore();
  const [tomorrow, setTomorrow] = useState(false);
  const [text, setText] = useState("");
  const [goalId, setGoalId] = useState<string | undefined>();

  const date = toDateKey(tomorrow ? addDays(new Date(), 1) : new Date());
  const tasks = tasksFor(date);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    addTask(date, text, goalId);
    setText("");
    setGoalId(undefined);
  };

  return (
    <section className="rounded-card border border-ligne p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display uppercase text-h2">
          {tomorrow ? "Demain" : "Aujourd'hui"}
        </h2>
        <button
          type="button"
          onClick={() => setTomorrow((t) => !t)}
          className="rounded-pill border border-ligne px-3 py-1.5 text-micro text-encre/70 transition-colors hover:border-terre"
        >
          {tomorrow ? "Revenir à aujourd'hui" : "Préparer demain"}
        </button>
      </div>

      {tasks.length > 0 ? (
        <ul className="mt-3">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-small text-encre/70">
          {tomorrow
            ? "Rien pour demain. Écris ce qui te ferait plaisir."
            : "Rien de prévu. Le soir, c'est le bon moment pour écrire demain."}
        </p>
      )}

      <form onSubmit={submit} className="mt-4 border-t border-ligne pt-4">
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ajouter quelque chose"
            aria-label={tomorrow ? "Ajouter une tâche pour demain" : "Ajouter une tâche"}
            className="min-w-0 flex-1 bg-transparent py-2 text-body placeholder:text-encre/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="rounded-pill border border-terre px-4 py-2 text-micro text-encre transition-opacity disabled:opacity-40"
          >
            Ajouter
          </button>
        </div>
        <div className="mt-2">
          <GoalPicker value={goalId} onChange={setGoalId} placeholder="lier à un objectif" />
        </div>
      </form>
    </section>
  );
}
