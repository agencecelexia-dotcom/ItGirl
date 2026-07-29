import { useRef, useState } from "react";
import { useStore } from "../lib/use-store";
import { fileToResizedDataUrl } from "../lib/image";
import { formatDayTitle, formatWeekLabel, startOfWeek, toDateKey } from "../lib/date";
import type { Photo } from "../lib/types";

/** Même traitement que la carte-titre : la date en capitales, la légende en script par-dessus. */
function SouvenirTile({ photo }: { photo: Photo }) {
  const { updatePhoto, deletePhoto } = useStore();
  const [editing, setEditing] = useState(false);
  const date = photo.date ? new Date(`${photo.date}T12:00:00`) : undefined;

  return (
    <figure className="group relative overflow-hidden rounded-card border border-terre bg-white p-1.5 shadow-soft">
      <div className="relative overflow-hidden rounded-[14px]">
        <img src={photo.url} alt={photo.caption ?? ""} className="aspect-[4/5] w-full object-cover" />

        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(59,42,32,.55), transparent 60%)" }}
        />

        <figcaption className="absolute inset-x-0 bottom-0 p-3">
          {date && (
            <p className="font-display uppercase tracking-[0.04em] text-beurre text-small leading-tight">
              {formatDayTitle(date)}
            </p>
          )}
          {editing ? (
            <input
              value={photo.caption ?? ""}
              onChange={(e) => updatePhoto(photo.id, { caption: e.target.value })}
              onBlur={() => setEditing(false)}
              autoFocus
              aria-label="Légende du souvenir"
              className="-mt-1 w-full bg-transparent font-script text-script text-rose placeholder:text-rose/70 focus:outline-none"
              placeholder="une légende"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="-mt-1 block w-full text-left font-script text-script text-rose"
            >
              {photo.caption || "une légende"}
            </button>
          )}
        </figcaption>
      </div>

      <button
        type="button"
        onClick={() => deletePhoto(photo.id)}
        aria-label="Retirer ce souvenir"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-pill bg-creme text-encre opacity-0 transition-opacity focus-visible:opacity-100 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      >
        <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden="true">
          <path
            d="M3 3 L11 11 M11 3 L3 11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </figure>
  );
}

export function Souvenirs() {
  const { photosFrom, addPhoto, storageFull } = useStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();

  const photos = photosFrom("souvenir");

  // Regroupés par semaine, de la plus récente à la plus ancienne.
  const weeks = new Map<string, Photo[]>();
  for (const photo of [...photos].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))) {
    const key = photo.date ? toDateKey(startOfWeek(new Date(`${photo.date}T12:00:00`))) : "sans-date";
    weeks.set(key, [...(weeks.get(key) ?? []), photo]);
  }

  const pickFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(undefined);
    const today = toDateKey(new Date());
    for (const file of files) {
      try {
        addPhoto(await fileToResizedDataUrl(file, 1000, 0.72), "souvenir", undefined, today);
      } catch {
        setError("Cette image n'a pas pu être lue. Essaie une autre.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display uppercase text-vin text-h1">Souvenirs</h1>
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="min-h-11 btn px-4 text-small text-encre"
        >
          Ajouter une photo
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            void pickFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {(error || storageFull) && (
        <p className="mt-3 text-small text-encre/70">
          {error ??
            "La mémoire de l'appareil est pleine. Retire quelques images pour pouvoir en garder d'autres."}
        </p>
      )}

      {photos.length === 0 ? (
        <p className="mt-3 text-small text-encre/70">
          Coche une balade et ajoute la photo : elle arrivera ici.
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {[...weeks].map(([key, week]) => (
            <section key={key}>
              <h2 className="font-display uppercase text-label text-encre/70 first-letter:uppercase">
                {key === "sans-date"
                  ? "Sans date"
                  : formatWeekLabel(new Date(`${key}T12:00:00`))}
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {week.map((photo) => (
                  <SouvenirTile key={photo.id} photo={photo} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
