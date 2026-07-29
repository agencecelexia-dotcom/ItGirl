import { useRef, useState } from "react";
import { useStore } from "../lib/use-store";
import { fileToResizedDataUrl } from "../lib/image";
import type { Photo } from "../lib/types";

function MoodTile({ photo }: { photo: Photo }) {
  const { updatePhoto, deletePhoto } = useStore();
  const [revealed, setRevealed] = useState(false);

  return (
    <figure className="group relative mb-2 break-inside-avoid">
      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        aria-expanded={revealed}
        aria-label={revealed ? "Masquer la légende" : "Voir la légende"}
        className="block w-full"
      >
        <img src={photo.url} alt={photo.caption ?? ""} className="w-full rounded-[14px]" />
      </button>

      <figcaption
        className={`pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[14px] px-3 pb-3 pt-8 transition-opacity [@media(hover:hover)]:group-hover:opacity-100 ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "linear-gradient(to top, rgba(59,42,32,.6), transparent)" }}
      >
        {revealed ? (
          <input
            value={photo.caption ?? ""}
            onChange={(e) => updatePhoto(photo.id, { caption: e.target.value })}
            placeholder="une légende, si tu veux"
            aria-label="Légende"
            className="pointer-events-auto w-full bg-transparent font-script text-script text-rose placeholder:text-rose/70 focus:outline-none"
          />
        ) : (
          photo.caption && <p className="font-script text-script text-rose">{photo.caption}</p>
        )}
      </figcaption>

      {revealed && (
        <button
          type="button"
          onClick={() => deletePhoto(photo.id)}
          aria-label="Retirer cette image"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-pill bg-creme text-encre"
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
      )}
    </figure>
  );
}

export function Moodboard() {
  const { photosFrom, addPhoto, storageFull } = useStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");
  const [error, setError] = useState<string>();

  const photos = photosFrom("moodboard");

  const pickFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(undefined);
    for (const file of files) {
      try {
        addPhoto(await fileToResizedDataUrl(file, 1000, 0.72), "moodboard");
      } catch {
        setError("Cette image n'a pas pu être lue. Essaie une autre.");
      }
    }
  };

  const submitLink = (event: React.FormEvent) => {
    event.preventDefault();
    addPhoto(link, "moodboard");
    setLink("");
  };

  return (
    <div className="px-3 py-5 sm:px-5 sm:py-8">
      <div className="mb-4 flex flex-wrap items-end gap-3 px-2">
        <h1 className="font-display uppercase text-vin text-h1">Moodboard</h1>

        <form onSubmit={submitLink} className="ml-auto flex items-center gap-2">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Coller un lien d'image"
            aria-label="Coller un lien d'image"
            className="w-44 border-b border-ligne bg-transparent py-2 text-small placeholder:text-encre/70 focus:border-terre focus:outline-none sm:w-56"
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="min-h-11 shrink-0 btn px-4 text-small text-encre"
          >
            Choisir une photo
          </button>
        </form>
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
        <p className="mb-4 px-2 text-small text-encre/70">
          {error ??
            "La mémoire de l'appareil est pleine. Retire quelques images pour pouvoir en garder d'autres."}
        </p>
      )}

      {photos.length > 0 ? (
        // Le seul écran sans cadre ni carte : rien que le mur.
        <div className="columns-2 gap-2 sm:columns-3 lg:columns-4">
          {photos.map((photo) => (
            <MoodTile key={photo.id} photo={photo} />
          ))}
        </div>
      ) : (
        <p className="px-2 text-small text-encre/70">
          Ajoute une première image pour poser l'ambiance du mois.
        </p>
      )}
    </div>
  );
}
