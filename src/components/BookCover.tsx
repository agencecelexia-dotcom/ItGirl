import type { Book } from "../lib/types";

/** Aplats autorisés : ni menthe, réservée aux félicitations, ni terre en surface pleine. */
const FLATS = ["bg-rose", "bg-beurre", "bg-ligne", "bg-rose/60", "bg-beurre/60"];

function flatFor(id: string): string {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return FLATS[hash % FLATS.length];
}

export function BookCover({ book }: { book: Book }) {
  if (book.cover_url) {
    return (
      <img
        src={book.cover_url}
        alt=""
        className="h-full w-full rounded-[14px] object-cover"
      />
    );
  }

  // À défaut de couverture, le titre en Bodoni sur un aplat de la palette.
  return (
    <div
      className={`flex h-full w-full flex-col justify-end rounded-[14px] p-3 ${flatFor(book.id)}`}
    >
      <p className="font-display uppercase leading-tight tracking-[0.03em] text-encre text-[13px] sm:text-sm">
        {book.title}
      </p>
      {book.author && <p className="mt-1 text-[10px] text-encre/70">{book.author}</p>}
    </div>
  );
}
