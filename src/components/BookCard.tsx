import { useRef, useState } from "react";
import { useStore } from "../lib/use-store";
import { fileToResizedDataUrl } from "../lib/image";
import { BookCover } from "./BookCover";
import type { Book } from "../lib/types";

function progressLabel(book: Book): string {
  if (book.current === 0) return "Pas encore ouvert.";
  if (book.total) return `${book.unit} ${book.current} sur ${book.total}`;
  return `${book.current} ${book.unit}${book.current > 1 ? "s" : ""}`;
}

export function BookCard({ book }: { book: Book }) {
  const { advanceBook, updateBook, deleteBook } = useStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [link, setLink] = useState("");
  const [error, setError] = useState<string>();

  const pickCover = async (file?: File) => {
    if (!file) return;
    setError(undefined);
    try {
      updateBook(book.id, { cover_url: await fileToResizedDataUrl(file, 500) });
    } catch {
      setError("Cette image n'a pas pu être lue. Essaie une autre.");
    }
  };

  const field =
    "mt-1 w-full border-b border-ligne bg-transparent py-2 text-[15px] placeholder:text-encre/50 focus:border-terre focus:outline-none";

  return (
    <article className="flex flex-col">
      {/* Un appui sur la couverture ouvre directement la galerie : rien d'autre à remplir. */}
      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        aria-label={
          book.cover_url ? `Changer la couverture de ${book.title}` : `Ajouter une couverture à ${book.title}`
        }
        className="aspect-[2/3] w-full overflow-hidden rounded-card border border-terre bg-white p-1.5 shadow-soft"
      >
        <BookCover book={book} />
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void pickCover(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div className="mt-2 min-w-0">
        {/* La couverture typographique porte déjà le titre : on ne le répète que sur une vraie image. */}
        {book.cover_url && (
          <>
            <h3 className="text-sm leading-snug">{book.title}</h3>
            {book.author && <p className="text-xs text-encre/70">{book.author}</p>}
          </>
        )}
        <p className="text-xs text-encre/70 first-letter:uppercase">{progressLabel(book)}</p>
      </div>

      {error && <p className="mt-1 text-xs text-encre/70">{error}</p>}

      {book.status !== "lu" && (
        <button
          type="button"
          onClick={() => advanceBook(book.id)}
          className="mt-2 min-h-11 rounded-pill border border-terre px-3 text-xs text-encre"
        >
          +1 {book.unit}
        </button>
      )}

      {book.status === "lu" &&
        (book.note ? (
          <p className="mt-2 text-xs italic text-encre/70">{book.note}</p>
        ) : (
          // Proposé à la fin d'un livre, jamais imposé : elle peut le laisser vide.
          <input
            value=""
            onChange={(e) => updateBook(book.id, { note: e.target.value })}
            placeholder="Une phrase, si tu veux."
            aria-label={`Note de fin de lecture pour ${book.title}`}
            className="mt-2 w-full border-b border-ligne bg-transparent py-1.5 text-xs italic placeholder:not-italic placeholder:text-encre/70 focus:border-terre focus:outline-none"
          />
        ))}

      <button
        type="button"
        onClick={() => setEditing((e) => !e)}
        className="mt-2 self-start rounded-pill px-1 py-1 text-xs text-encre/70 underline underline-offset-4"
      >
        {editing ? "Terminé" : "Modifier"}
      </button>

      {editing && (
        <div className="mt-2 space-y-2 border-t border-ligne pt-3">
          <label className="block">
            <span className="text-xs text-encre/70">Titre</span>
            <input
              value={book.title}
              onChange={(e) => updateBook(book.id, { title: e.target.value })}
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-xs text-encre/70">Auteur</span>
            <input
              value={book.author ?? ""}
              onChange={(e) => updateBook(book.id, { author: e.target.value || undefined })}
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-xs text-encre/70">Où tu en es</span>
            <input
              type="number"
              min={0}
              value={book.current}
              onChange={(e) => updateBook(book.id, { current: Math.max(0, Number(e.target.value)) })}
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-xs text-encre/70">Total, si tu le connais</span>
            <input
              type="number"
              min={0}
              value={book.total ?? ""}
              onChange={(e) =>
                updateBook(book.id, { total: Number(e.target.value) || undefined })
              }
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-xs text-encre/70">Couverture par lien</span>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onBlur={() => {
                if (link.trim()) updateBook(book.id, { cover_url: link.trim() });
                setLink("");
              }}
              placeholder="Colle une adresse d'image"
              className={field}
            />
          </label>
          <button
            type="button"
            onClick={() => deleteBook(book.id)}
            className="min-h-11 rounded-pill border border-ligne px-3 text-xs text-encre/70"
          >
            Retirer de l'étagère
          </button>
        </div>
      )}
    </article>
  );
}
