import { useStore } from "../lib/use-store";
import { addDays, toDateKey, weeksOfMonth } from "../lib/date";
import { goalColor } from "../lib/colors";
import type { Goal } from "../lib/types";

const ROW = 26;
const BAR = 9;
const LABEL_WIDTH = 74;
const WIDTH = 260;

const ORDINALS = ["1re", "2e", "3e", "4e", "5e", "6e"];

export function WeekBars({ goal }: { goal: Goal }) {
  const { goalLogs } = useStore();
  const weeks = weeksOfMonth(new Date());

  const counts = weeks.map((monday) => {
    const from = toDateKey(monday);
    const to = toDateKey(addDays(monday, 6));
    return goalLogs.filter((l) => l.goal_id === goal.id && l.date >= from && l.date <= to).length;
  });

  const scale = Math.max(goal.target, ...counts, 1);
  const track = WIDTH - LABEL_WIDTH;

  return (
    <section>
      <h3 className="font-display uppercase text-label text-encre/70">
        Semaine après semaine
      </h3>
      <p className="mt-1 text-micro text-encre/70">{goal.name}</p>
      <svg
        viewBox={`0 0 ${WIDTH} ${weeks.length * ROW}`}
        className="mt-3 w-full max-w-[320px]"
        role="img"
        aria-label={counts
          .map((c, i) => `${ORDINALS[i]} semaine : ${c}`)
          .join(", ")}
      >
        {counts.map((count, i) => (
          <g key={i} transform={`translate(0 ${i * ROW})`}>
            <text
              x="0"
              y={ROW / 2 + 4}
              className="fill-encre/70"
              style={{ font: '400 11px "Instrument Sans", sans-serif' }}
            >
              {ORDINALS[i]} semaine
            </text>
            <rect
              x={LABEL_WIDTH}
              y={(ROW - BAR) / 2}
              width={track}
              height={BAR}
              rx={BAR / 2}
              fill="var(--color-ligne)"
            />
            {count > 0 && (
              <rect
                x={LABEL_WIDTH}
                y={(ROW - BAR) / 2}
                width={Math.max(BAR, (count / scale) * track)}
                height={BAR}
                rx={BAR / 2}
                fill={goalColor(goal)}
              />
            )}
          </g>
        ))}
      </svg>
    </section>
  );
}
