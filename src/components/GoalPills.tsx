interface GoalPillsProps {
  count: number;
  /** 0 = objectif libre : on n'affiche que les pastilles remplies, jamais un manque. */
  target: number;
  /** Couleur CSS de l'objectif, pour qu'on le reconnaisse à sa teinte. */
  color: string;
  /** Index de la pastille qui vient de se remplir, pour le petit dépassement d'échelle. */
  popped?: number;
  waving?: boolean;
}

export function GoalPills({ count, target, color, popped, waving }: GoalPillsProps) {
  const base = target > 0 ? target : count;
  const bonus = target > 0 ? Math.max(0, count - target) : 0;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-hidden="true">
      {Array.from({ length: base }, (_, i) => {
        const filled = i < count;
        return (
          <span
            key={i}
            className="goal-pill h-3.5 w-3.5 rounded-pill border transition-colors"
            data-filled={filled}
            data-pop={popped === i}
            data-wave={waving}
            style={
              {
                "--pill-index": i,
                backgroundColor: filled ? color : "transparent",
                borderColor: filled ? color : "var(--color-terre)",
              } as React.CSSProperties
            }
          />
        );
      })}

      {bonus > 0 && (
        <span className="ml-1 flex items-center gap-1.5">
          {Array.from({ length: bonus }, (_, i) => (
            <span
              key={i}
              className="goal-pill h-2 w-2 btn bg-miel"
              data-filled="true"
              data-pop={popped === target + i}
            />
          ))}
        </span>
      )}
    </div>
  );
}
