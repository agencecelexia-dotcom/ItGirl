import { BookCover } from "./BookCover";
import type { Book } from "../lib/types";

function progressLabel(book: Book): string {
  if (book.current === 0) return "Pas encore ouvert.";
  if (book.total) return `${book.unit} ${book.current} sur ${book.total}`;
  return `${book.current} ${book.unit}${book.current > 1 ? "s" : ""}`;
}

export function BookCard({ book, onOpen }: { book: Book; onOpen: () => void }) {
  return (
    <article>
      <button type="button" onClick={onOpen} className="w-full text-left">
        <span className="block aspect-[2/3] w-full overflow-hidden rounded-card border border-terre bg-white p-1.5 shadow-soft">
          <BookCover book={book} />
        </span>

        {/* La couverture typographique porte déjà le titre : on ne le répète que sur une vraie image. */}
        {book.cover_url && (
          <>
            <span className="mt-2 block text-small leading-snug">{book.title}</span>
            {book.author && (
              <span className="block text-micro text-encre/70">{book.author}</span>
            )}
          </>
        )}
        <span className="mt-1 block text-micro text-encre/70 first-letter:uppercase">
          {progressLabel(book)}
        </span>
      </button>
    </article>
  );
}
