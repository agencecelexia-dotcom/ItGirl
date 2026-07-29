import { useState } from "react";
import { useStore } from "../lib/use-store";
import { BookCard } from "../components/BookCard";
import { BookDetail } from "../components/BookDetail";
import type { Book, BookStatus } from "../lib/types";

/** Tri automatique : ce qui attend, ce qui est en train, ce qui est fini. */
const ORDER: BookStatus[] = ["à lire", "en cours", "lu"];

export function Lectures() {
  const { books, addBook } = useStore();
  const [openedId, setOpenedId] = useState<string>();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [unit, setUnit] = useState<Book["unit"]>("page");
  const [total, setTotal] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    addBook(title, author, unit, Number(total) || undefined);
    setTitle("");
    setAuthor("");
    setTotal("");
    setOpen(false);
  };

  const field =
    "mt-1 w-full border-b border-ligne bg-transparent py-2 text-[15px] placeholder:text-encre/50 focus:border-terre focus:outline-none";

  const opened = books.find((book) => book.id === openedId);
  if (opened) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-5 sm:px-8 sm:py-8">
        <BookDetail book={opened} onBack={() => setOpenedId(undefined)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-5 sm:px-8 sm:py-8">
      <h1 className="font-display uppercase tracking-[0.03em] text-2xl sm:text-3xl">Lectures</h1>

      {books.length === 0 && (
        <p className="mt-2 text-sm text-encre/70">
          L'étagère est vide. Ajoute un livre, même un que tu n'as pas encore ouvert.
        </p>
      )}

      <div className="mt-6 space-y-8">
        {ORDER.map((status) => {
          const shelf = books.filter((book) => book.status === status);
          if (shelf.length === 0) return null;

          return (
            <section key={status}>
              <h2 className="font-display uppercase tracking-[0.03em] text-sm text-encre/70">
                {status}
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                {shelf.map((book) => (
                  <BookCard key={book.id} book={book} onOpen={() => setOpenedId(book.id)} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {open ? (
        <form onSubmit={submit} className="mt-8 space-y-3 rounded-card border border-ligne p-5">
          <label className="block">
            <span className="text-xs text-encre/70">Titre</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="L'Amie prodigieuse"
              autoFocus
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-xs text-encre/70">Auteur</span>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Elena Ferrante"
              className={field}
            />
          </label>

          <fieldset>
            <legend className="text-xs text-encre/70">Tu comptes en</legend>
            <div className="mt-2 flex gap-2">
              {(["page", "chapitre"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setUnit(option)}
                  aria-pressed={unit === option}
                  className={`min-h-11 rounded-pill border px-4 text-sm transition-colors ${
                    unit === option ? "border-terre text-encre" : "border-ligne text-encre/70"
                  }`}
                >
                  {option}s
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-xs text-encre/70">Combien en tout, si tu le sais</span>
            <input
              type="number"
              min={0}
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className={field}
            />
          </label>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="min-h-11 rounded-pill border border-terre px-4 text-sm text-encre transition-opacity disabled:opacity-40"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="min-h-11 rounded-pill border border-ligne px-4 text-sm text-encre/70"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-8 min-h-11 w-full rounded-card border border-ligne px-4 text-sm text-encre/70 transition-colors hover:border-terre"
        >
          Ajouter un livre
        </button>
      )}
    </div>
  );
}
