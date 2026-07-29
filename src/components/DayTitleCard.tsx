import { useRef, useState } from "react";
import { formatDayTitle } from "../lib/date";
import { fileToResizedDataUrl } from "../lib/image";

interface DayTitleCardProps {
  date: Date;
  photoUrl?: string;
  moodWord?: string;
  onPickPhoto: (url: string) => void;
}

export function DayTitleCard({ date, photoUrl, moodWord = "douce", onPickPhoto }: DayTitleCardProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();

  const pick = async (file?: File) => {
    if (!file) return;
    setError(undefined);
    try {
      onPickPhoto(await fileToResizedDataUrl(file, 1200, 0.75));
    } catch {
      setError("Cette image n'a pas pu être lue. Essaie une autre.");
    }
  };

  return (
    <>
      {/*
        Tant qu'aucune photo n'est là, la carte se fait basse : elle n'a rien à
        montrer et ne doit pas manger l'écran. La photo posée, elle reprend sa
        place de vignette et devient l'élément que la journée laisse en mémoire.
      */}
      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        aria-label={
          photoUrl ? "Changer la photo du jour" : "Ajouter la photo du jour"
        }
        className={`relative block w-full overflow-hidden rounded-card text-left shadow-soft ${
          photoUrl ? "aspect-[4/5] sm:aspect-[16/10]" : ""
        }`}
      >
        {photoUrl ? (
          <img src={photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div
            className="absolute inset-0 bg-creme"
            style={{
              backgroundImage: `
                radial-gradient(90% 120% at 12% 10%, color-mix(in srgb, var(--color-cerisier) 75%, transparent), transparent 65%),
                radial-gradient(80% 130% at 90% 20%, color-mix(in srgb, var(--color-miel) 55%, transparent), transparent 60%),
                radial-gradient(95% 140% at 62% 105%, color-mix(in srgb, var(--color-campanule) 65%, transparent), transparent 65%),
                repeating-linear-gradient(135deg, var(--color-ligne) 0px, var(--color-ligne) 1px, transparent 1px, transparent 14px)
              `,
            }}
          />
        )}

        {/*
          Le voile est porté par le bloc de texte, pas par la carte : il épouse
          sa hauteur, que le jour tienne sur une ligne ou déborde sur deux.
        */}
        <div
          className={`p-5 sm:p-6 ${
            photoUrl ? "absolute inset-x-0 bottom-0 pt-20 sm:pt-24" : "relative"
          }`}
          style={
            photoUrl
              ? {
                  background:
                    "linear-gradient(to top, rgba(59,42,32,0.66), rgba(59,42,32,0.5) 45%, transparent)",
                }
              : undefined
          }
        >
          <p
            className={`font-display uppercase text-balance ${
              photoUrl ? "text-beurre text-display" : "text-encre text-h1"
            }`}
          >
            {formatDayTitle(date)}
          </p>
          <p
            className={`font-script -rotate-3 -mt-1 ml-4 sm:ml-8 ${
              photoUrl ? "text-rose text-script-lg" : "text-vin text-script"
            }`}
          >
            {moodWord}
          </p>

          {!photoUrl && (
            <p className="mt-2 text-micro text-encre/70">
              Appuie ici pour poser la photo du jour.
            </p>
          )}
        </div>
      </button>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-2 text-small text-encre/70">{error}</p>}
    </>
  );
}
