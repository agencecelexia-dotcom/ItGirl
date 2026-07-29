import { DayTitleCard } from "../components/DayTitleCard";

export function Today() {
  return (
    <div className="px-5 py-5 sm:px-8 sm:py-8">
      <DayTitleCard date={new Date()} />

      <div className="mt-6 space-y-4">
        <div className="rounded-card border border-ligne p-5">
          <p className="text-sm text-encre/50">La to-do du jour arrive bientôt.</p>
        </div>
        <div className="rounded-card border border-ligne p-5">
          <p className="text-sm text-encre/50">Les rituels du jour arrivent bientôt.</p>
        </div>
      </div>
    </div>
  );
}
