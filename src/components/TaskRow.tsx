import { useStore } from "../lib/use-store";
import { GoalPicker } from "./GoalPicker";
import type { Task } from "../lib/types";

/** La pastille porte déjà le nom de l'objectif : inutile de le répéter ici. */
function progressLabel(count: number, target: number): string {
  return target > 0
    ? `${count} sur ${target} cette semaine`
    : `${count} fois cette semaine`;
}

export function TaskRow({ task }: { task: Task }) {
  const { goals, toggleTask, deleteTask, setTaskGoal, goalProgress } = useStore();
  const goal = goals.find((g) => g.id === task.goal_id);

  return (
    <li className="flex items-start gap-1">
      <button
        type="button"
        onClick={() => toggleTask(task.id)}
        aria-pressed={task.done}
        aria-label={task.done ? `Décocher ${task.text}` : `Cocher ${task.text}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center"
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-pill border transition-colors ${
            task.done ? "border-rose bg-rose" : "border-terre"
          }`}
        >
          {task.done && (
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
              <path
                d="M2.5 6.2 L4.8 8.5 L9.5 3.8"
                fill="none"
                stroke="var(--color-encre)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </button>

      <div className="min-w-0 flex-1 py-2.5">
        <p>
          <span className="task-text text-[15px] leading-relaxed" data-done={task.done}>
            {task.text}
          </span>
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <GoalPicker value={task.goal_id} onChange={(id) => setTaskGoal(task.id, id)} />
          {task.done && goal && (
            <span className="text-xs text-encre/70">
              {progressLabel(goalProgress(goal.id, new Date()), goal.target)}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => deleteTask(task.id)}
        aria-label={`Supprimer ${task.text}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center text-encre/70"
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
    </li>
  );
}
