import { useRef, useState } from "react";
import { useStore } from "../lib/use-store";
import { fileToResizedDataUrl } from "../lib/image";
import { GoalPicker } from "./GoalPicker";
import { goalColor } from "../lib/colors";
import type { Task } from "../lib/types";

/** La pastille porte déjà le nom de l'objectif : inutile de le répéter ici. */
function progressLabel(count: number, target: number): string {
  return target > 0
    ? `${count} sur ${target} cette semaine`
    : `${count} fois cette semaine`;
}

export function TaskRow({ task }: { task: Task }) {
  const { goals, toggleTask, deleteTask, setTaskGoal, goalProgress, attachPhotoToTask, photoById } =
    useStore();
  const goal = goals.find((g) => g.id === task.goal_id);
  const photo = photoById(task.photo_id);
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();

  const pickPhoto = async (file?: File) => {
    if (!file) return;
    setError(undefined);
    try {
      attachPhotoToTask(task.id, await fileToResizedDataUrl(file, 1000, 0.72));
    } catch {
      setError("Cette image n'a pas pu être lue. Essaie une autre.");
    }
  };

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
            task.done ? "border-transparent" : "border-terre"
          }`}
          style={
            task.done
              ? { backgroundColor: goal ? goalColor(goal) : "var(--color-rose)" }
              : undefined
          }
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
          <span
            className="task-text text-body leading-relaxed"
            data-done={task.done}
            style={goal ? ({ "--trait": goalColor(goal) } as React.CSSProperties) : undefined}
          >
            {task.text}
          </span>
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {photo && (
            <img
              src={photo.url}
              alt=""
              className="h-10 w-10 shrink-0 rounded-[10px] border border-terre object-cover"
            />
          )}
          <GoalPicker value={task.goal_id} onChange={(id) => setTaskGoal(task.id, id)} />

          {/* Une photo sur une tâche cochée part directement dans les souvenirs. */}
          {task.done && !photo && (
            <>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="rounded-pill border border-ligne px-2.5 py-1 text-micro text-encre/70 transition-colors hover:border-terre"
              >
                + photo
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  void pickPhoto(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </>
          )}

          {task.done && goal && (
            <span className="text-micro text-encre/70">
              {progressLabel(goalProgress(goal.id, new Date()), goal.target)}
            </span>
          )}
        </div>
        {error && <p className="mt-1 text-micro text-encre/70">{error}</p>}
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
