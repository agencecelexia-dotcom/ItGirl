import { useState } from "react";
import { useStore } from "../lib/use-store";
import { GoalCard } from "../components/GoalCard";
import { MonthGrid } from "../components/MonthGrid";
import { WeekBars } from "../components/WeekBars";

export function Objectifs() {
  const { goals, addGoal } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [target, setTarget] = useState(1);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    addGoal(name, target, unit);
    setName("");
    setUnit("");
    setTarget(1);
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-5 sm:px-8 sm:py-8">
      <h1 className="font-display uppercase text-vin text-h1">Objectifs</h1>
      <p className="mt-1 text-small text-encre/70">
        Des planchers, jamais des plafonds. Dépasser est un bonus.
      </p>

      <div className="mt-6 space-y-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {open ? (
        <form onSubmit={submit} className="panel tone-cerisier mt-4 space-y-3 p-5">
          <label className="block">
            <span className="text-micro text-encre/70">Nom</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Cours de danse"
              autoFocus
              className="field mt-1 w-full px-3 py-2.5 text-body placeholder:text-encre/50 focus:border-terre focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-micro text-encre/70">Une fois, ça s'appelle</span>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="séance"
              className="field mt-1 w-full px-3 py-2.5 text-body placeholder:text-encre/50 focus:border-terre focus:outline-none"
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
              value={target}
              onChange={(e) => setTarget(Math.max(0, Number(e.target.value)))}
              className="field mt-1 w-full px-3 py-2.5 text-body focus:border-terre focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="min-h-11 btn px-4 text-small text-encre transition-opacity disabled:opacity-40"
            >
              Créer
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="min-h-11 btn-quiet px-4 text-small text-encre/70"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-quiet mt-4 min-h-11 w-full px-4 text-small text-encre/70 transition-colors hover:border-terre"
        >
          Ajouter un objectif
        </button>
      )}

      <div className="mt-10 space-y-8 border-t border-ligne pt-8">
        <MonthGrid />
        {goals[0] && <WeekBars goal={goals[0]} />}
      </div>
    </div>
  );
}
