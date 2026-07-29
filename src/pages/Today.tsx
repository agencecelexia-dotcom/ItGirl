import { DayTitleCard } from "../components/DayTitleCard";
import { YesterdayReminder } from "../components/YesterdayReminder";
import { TodoSection } from "../components/TodoSection";
import { Rituals } from "../components/Rituals";
import { EveningCheckIn } from "../components/EveningCheckIn";
import { useStore } from "../lib/use-store";
import { toDateKey } from "../lib/date";

export function Today() {
  const { entryFor, photoById, setDayCover } = useStore();
  const today = new Date();
  const key = toDateKey(today);
  const entry = entryFor(key);
  const cover = photoById(entry?.cover_photo_id);

  return (
    <div className="mx-auto max-w-2xl px-5 py-5 sm:px-8 sm:py-8">
      <DayTitleCard
        date={today}
        photoUrl={cover?.url}
        moodWord={entry?.word?.trim() || "douce"}
        onPickPhoto={(url) => setDayCover(key, url)}
      />

      <div className="mt-6 space-y-4">
        <YesterdayReminder />
        <TodoSection />
        <Rituals />
        <EveningCheckIn />
      </div>
    </div>
  );
}
