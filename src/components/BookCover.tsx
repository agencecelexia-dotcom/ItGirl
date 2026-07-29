import { coverColorToken, cssColor } from "../lib/colors";
import type { Book } from "../lib/types";

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
      className="flex h-full w-full flex-col justify-end rounded-[14px] p-3"
      style={{ backgroundColor: cssColor(coverColorToken(book.id)) }}
    >
      <p className="font-display uppercase leading-tight tracking-[0.03em] text-encre text-[13px] sm:text-sm">
        {book.title}
      </p>
      {/* Pleine encre : à 70 % le nom passait sous le AA sur les aplats soutenus. */}
      {book.author && <p className="mt-1 text-[10px] text-encre">{book.author}</p>}
    </div>
  );
}
