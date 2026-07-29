import { useState } from "react";
import { useStore } from "../lib/use-store";
import { cssColor, goalColorToken, tint } from "../lib/colors";

interface GoalPickerProps {
  value?: string;
  onChange: (goalId?: string) => void;
  /** Libellé affiché quand aucun objectif n'est choisi. */
  placeholder?: string;
}

export function GoalPicker({ value, onChange, placeholder = "objectif" }: GoalPickerProps) {
  const { goals } = useStore();
  const [open, setOpen] = useState(false);
  const selected = goals.find((g) => g.id === value);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`rounded-pill border px-2.5 py-1 text-micro transition-colors ${
          selected ? "text-encre" : "border-ligne text-encre/70 hover:border-terre"
        }`}
        style={
          selected
            ? {
                borderColor: cssColor(goalColorToken(selected)),
                backgroundColor: tint(goalColorToken(selected), 35),
              }
            : undefined
        }
      >
        {selected ? selected.name : `+ ${placeholder}`}
      </button>

      {open && (
        <>
          <span
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <span className="absolute bottom-full left-0 z-20 mb-1 flex w-max flex-col gap-0.5 rounded-card border border-ligne bg-creme p-1.5 shadow-soft">
            {goals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => {
                  onChange(goal.id);
                  setOpen(false);
                }}
                className="rounded-pill px-3 py-1.5 text-left text-micro text-encre hover:bg-ligne/60"
              >
                {goal.name}
              </button>
            ))}
            {selected && (
              <button
                type="button"
                onClick={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
                className="rounded-pill px-3 py-1.5 text-left text-micro text-encre/70 hover:bg-ligne/60"
              >
                Aucun
              </button>
            )}
          </span>
        </>
      )}
    </span>
  );
}
