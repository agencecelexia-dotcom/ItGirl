import { formatDayTitle } from "../lib/date";

interface DayTitleCardProps {
  date: Date;
  photoUrl?: string;
  moodWord?: string;
}

export function DayTitleCard({ date, photoUrl, moodWord = "douce" }: DayTitleCardProps) {
  return (
    <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden rounded-card shadow-soft">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 bg-creme"
          style={{
            backgroundImage: `
              radial-gradient(120% 90% at 15% 10%, rgba(217,168,124,0.18), transparent 60%),
              repeating-linear-gradient(135deg, var(--color-ligne) 0px, var(--color-ligne) 1px, transparent 1px, transparent 14px)
            `,
          }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(59,42,32,0.45), transparent 55%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <p className="relative inline-block font-display uppercase text-beurre tracking-[0.04em] text-[28px] leading-[1.05] sm:text-[40px] lg:text-[56px]">
          {formatDayTitle(date)}
        </p>
        <p className="font-script text-rose text-3xl lg:text-5xl -rotate-3 -mt-2 ml-4 sm:ml-8">
          {moodWord}
        </p>
      </div>
    </div>
  );
}
