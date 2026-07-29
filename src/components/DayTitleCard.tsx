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
            // Sans photo, un lavis de la palette : la carte reste l'élément qui porte l'écran.
            backgroundImage: `
              radial-gradient(90% 70% at 12% 8%, color-mix(in srgb, var(--color-cerisier) 75%, transparent), transparent 65%),
              radial-gradient(80% 70% at 90% 20%, color-mix(in srgb, var(--color-miel) 55%, transparent), transparent 60%),
              radial-gradient(95% 85% at 60% 105%, color-mix(in srgb, var(--color-campanule) 65%, transparent), transparent 65%),
              repeating-linear-gradient(135deg, var(--color-ligne) 0px, var(--color-ligne) 1px, transparent 1px, transparent 14px)
            `,
          }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          // Resserré sur le bas : juste ce qu'il faut pour le titre, sans éteindre le fond.
          background: "linear-gradient(to top, rgba(59,42,32,0.52), transparent 38%)",
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
