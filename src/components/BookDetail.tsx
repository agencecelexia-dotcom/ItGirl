import { useRef, useState } from "react";
import { useStore } from "../lib/use-store";
import { fileToResizedDataUrl } from "../lib/image";
import { formatDayLong } from "../lib/date";
import { BookCover } from "./BookCover";
import type { Book } from "../lib/types";

function progressLabel(book: Book): string {
  if (book.current === 0) return "Pas encore ouvert.";
  if (book.total) return `${book.unit} ${book.current} sur ${book.total}`;
  return `${book.current} ${book.unit}${book.current > 1 ? "s" : ""}`;
}

export function BookDetail({ book, onBack }: { book: Book; onBack: () => void }) {
  const { updateBook, deleteBook, logReading, sessionsFor, deleteSession } = useStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState("");
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [link, setLink] = useState("");
  const [error, setError] = useState<string>();

  const sessions = sessionsFor(book.id);

  const pickCover = async (file?: File) => {
    if (!file) return;
    setError(undefined);
    try {
      updateBook(book.id, { cover_url: await fileToResizedDataUrl(file, 500) });
    } catch {
      setError("Cette image n'a pas pu être lue. Essaie une autre.");
    }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = Number(position);
    if (!value || value < 0) return;
    logReading(book.id, value, note);
    setPosition("");
    setNote("");
  };

  const field =
    "field mt-1 w-full px-3 py-2.5 text-body placeholder:text-encre/50 focus:border-terre focus:outline-none";

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="min-h-11 text-small text-encre/70 underline underline-offset-4"
      >
        ← Retour à l'étagère
      </button>

      <div className="mt-4 flex flex-wrap gap-5 sm:flex-nowrap">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          aria-label={book.cover_url ? "Changer la couverture" : "Ajouter une couverture"}
          className="aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-card border border-terre bg-white p-1.5 shadow-soft sm:w-40"
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

        <div className="min-w-0 flex-1">
          <h1 className="font-display uppercase text-h1">
            {book.title}
          </h1>
          {book.author && <p className="mt-1 text-small text-encre/70">{book.author}</p>}
          <p className="mt-3 text-small text-encre/70 first-letter:uppercase">
            {progressLabel(book)}
          </p>

          {book.total !== undefined && book.total > 0 && (
            <div className="mt-2 h-2 w-full max-w-64 overflow-hidden rounded-pill bg-ligne">
              <div
                className="h-full rounded-pill bg-rose"
                style={{ width: `${Math.min(100, (book.current / book.total) * 100)}%` }}
              />
            </div>
          )}

          {error && <p className="mt-2 text-small text-encre/70">{error}</p>}

          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            className="mt-3 min-h-11 text-micro text-encre/70 underline underline-offset-4"
          >
            {editing ? "Terminé" : "Modifier ce livre"}
          </button>
        </div>
      </div>

      {editing && (
        <div className="panel tone-fenouil mt-4 space-y-3 p-5">
          <label className="block">
            <span className="text-micro text-encre/70">Titre</span>
            <input
              value={book.title}
              onChange={(e) => updateBook(book.id, { title: e.target.value })}
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-micro text-encre/70">Auteur</span>
            <input
              value={book.author ?? ""}
              onChange={(e) => updateBook(book.id, { author: e.target.value || undefined })}
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-micro text-encre/70">
              Combien de {book.unit}s en tout, si tu le sais
            </span>
            <input
              type="number"
              min={0}
              value={book.total ?? ""}
              onChange={(e) => updateBook(book.id, { total: Number(e.target.value) || undefined })}
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-micro text-encre/70">Couverture par lien</span>
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
            onClick={() => {
              deleteBook(book.id);
              onBack();
            }}
            className="min-h-11 btn-quiet px-4 text-small text-encre/70"
          >
            Retirer de l'étagère
          </button>
        </div>
      )}

      <form onSubmit={submit} className="panel tone-cerisier mt-6 p-5">
        <h2 className="font-display uppercase text-h2">Je viens de lire</h2>

        <label className="mt-3 block">
          <span className="text-micro text-encre/70">
            Je me suis arrêtée {book.unit === "page" ? "à la page" : "au chapitre"}
          </span>
          <input
            type="number"
            min={1}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder={book.current > 0 ? `Tu étais ${book.unit} ${book.current}` : ""}
            className={field}
          />
        </label>

        <label className="mt-3 block">
          <span className="text-micro text-encre/70">Ce que tu en retiens</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Deux mots sur ce passage, si tu veux."
            className="mt-1 field w-full resize-none p-3 text-body leading-relaxed placeholder:text-encre/50 focus:border-terre focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={!Number(position)}
          className="mt-4 min-h-11 btn px-4 text-small text-encre transition-opacity disabled:opacity-40"
        >
          Enregistrer
        </button>
      </form>

      {book.status === "lu" && (
        <section className="mt-4 rounded-card bg-menthe/25 p-5">
          <p className="font-script text-script text-encre">Tu l'as fini.</p>
          {book.note ? (
            <p className="mt-2 text-small italic">{book.note}</p>
          ) : (
            <input
              value=""
              onChange={(e) => updateBook(book.id, { note: e.target.value })}
              placeholder="Une phrase sur ce livre, si tu veux."
              aria-label="Note de fin de lecture"
              className="mt-2 w-full border-b border-encre/20 bg-transparent py-2 text-small italic placeholder:not-italic placeholder:text-encre/70 focus:border-encre/40 focus:outline-none"
            />
          )}
        </section>
      )}

      {sessions.length > 0 && (
        <section className="mt-6">
          <h2 className="font-display uppercase text-label text-encre/70">
            Journal de lecture
          </h2>
          <ul className="mt-3 space-y-4">
            {sessions.map((session) => (
              <li key={session.id} className="group border-l border-ligne pl-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-micro text-encre/70 first-letter:uppercase">
                    {formatDayLong(new Date(`${session.date}T12:00:00`))} · {book.unit}{" "}
                    {session.position}
                  </p>
                  <button
                    type="button"
                    onClick={() => deleteSession(session.id)}
                    aria-label="Supprimer cette lecture"
                    className="shrink-0 text-micro text-encre/70 opacity-0 transition-opacity focus-visible:opacity-100 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                  >
                    ✕
                  </button>
                </div>
                {session.note && <p className="mt-1 text-small italic leading-relaxed">{session.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
