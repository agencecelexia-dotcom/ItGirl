import { useEffect, useRef, useState } from "react";
import { useStore } from "../lib/use-store";
import { GoalPills } from "./GoalPills";
import { cssColor, goalColorToken, tint } from "../lib/colors";
import type { Goal } from "../lib/types";

const NUMBERS = ["", "une", "deux", "trois", "quatre", "cinq", "six", "sept"];

function progressLabel(count: number, target: number): string {
  return target > 0 ? `${count} sur ${target} cette semaine` : `${count} fois cette semaine`;
}

/** Accord au féminin : les objectifs d'origine (balade, sortie, lecture) le sont tous. */
function celebrationText(goal: Goal): string {
  if (goal.target === 1) return `Bravo, ta ${goal.unit} de la semaine est faite.`;
  const n = NUMBERS[goal.target] ?? String(goal.target);
  return `Bravo, tes ${n} ${goal.unit}s de la semaine sont faites.`;
}

export function GoalCard({ goal }: { goal: Goal }) {
  const { goalProgress, manualLogCount, addGoalLog, removeGoalLog, updateGoal, deleteGoal } =
    useStore();
  const today = new Date();
  const count = goalProgress(goal.id, today);
  const reached = goal.target > 0 && count >= goal.target;
  const colorToken = goalColorToken(goal);

  const [editing, setEditing] = useState(false);
  const [popped, setPopped] = useState<number>();
  const [justReached, setJustReached] = useState(false);
  const previous = useRef(count);

  useEffect(() => {
    const before = previous.current;
    previous.current = count;
    if (count <= before) return;

    setPopped(count - 1);
    const popTimer = setTimeout(() => setPopped(undefined), 320);

    // La cascade et le bandeau ne se déclenchent qu'au franchissement, jamais à l'affichage.
    if (goal.target > 0 && before < goal.target && count >= goal.target) {
      setJustReached(true);
      const waveTimer = setTimeout(() => setJustReached(false), 300 + goal.target * 60);
      return () => {
        clearTimeout(popTimer);
        clearTimeout(waveTimer);
      };
    }
    return () => clearTimeout(popTimer);
  }, [count, goal.target]);

  return (
    // La carte porte discrètement la teinte de son objectif, jusque dans son cadre.
    <section
      className="rounded-card border p-5"
      style={{ borderColor: tint(colorToken, 55), backgroundColor: tint(colorToken, 7) }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display uppercase text-h2">{goal.name}</h3>
        <button
          type="button"
          onClick={() => setEditing((e) => !e)}
          className="rounded-pill border border-ligne px-3 py-1.5 text-micro text-encre/70 transition-colors hover:border-terre"
        >
          {editing ? "Terminé" : "Modifier"}
        </button>
      </div>

      {goal.note && <p className="mt-1 text-small text-encre/70">{goal.note}</p>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-2">
          <GoalPills
            count={count}
            target={goal.target}
            color={cssColor(colorToken)}
            popped={popped}
            waving={justReached}
          />
          <p className="text-small text-encre/70">{progressLabel(count, goal.target)}</p>
          {goal.target > 0 && count > goal.target && (
            <span className="sr-only">
              Une {goal.unit} en plus, juste pour le plaisir.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => removeGoalLog(goal.id, today)}
            disabled={manualLogCount(goal.id, today) === 0}
            aria-label={`Retirer une ${goal.unit}`}
            className="h-11 w-11 rounded-pill border border-ligne text-encre transition-opacity disabled:opacity-40"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => addGoalLog(goal.id, today)}
            className="min-h-11 rounded-pill border border-terre px-4 text-small text-encre"
          >
            C'est fait
          </button>
        </div>
      </div>

      {reached && (
        // Le rose poudré sur menthe pâle tombe à ~1,3:1 : illisible. On garde la voix
        // du script et la menthe, l'encre rétablit le contraste exigé en AA.
        <p
          key={justReached ? "celebrating" : "steady"}
          className={`mt-4 rounded-card bg-menthe/25 px-4 py-3 font-script text-script text-encre ${
            justReached ? "celebration" : ""
          }`}
        >
          {celebrationText(goal)}
        </p>
      )}

      {editing && (
        <div className="mt-4 space-y-3 border-t border-ligne pt-4">
          <label className="block">
            <span className="text-micro text-encre/70">Nom</span>
            <input
              value={goal.name}
              onChange={(e) => updateGoal(goal.id, { name: e.target.value })}
              className="mt-1 w-full border-b border-ligne bg-transparent py-2 text-body focus:border-terre focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-micro text-encre/70">
              Combien par semaine — laisse à zéro pour un objectif libre
            </span>
            <input
              type="number"
              min={0}
              max={7}
              value={goal.target}
              onChange={(e) => updateGoal(goal.id, { target: Math.max(0, Number(e.target.value)) })}
              className="mt-1 w-full border-b border-ligne bg-transparent py-2 text-body focus:border-terre focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => deleteGoal(goal.id)}
            className="min-h-11 rounded-pill border border-ligne px-4 text-small text-encre/70 transition-colors hover:border-terre"
          >
            Supprimer cet objectif
          </button>
        </div>
      )}
    </section>
  );
}
