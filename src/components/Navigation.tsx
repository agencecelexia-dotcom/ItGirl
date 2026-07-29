import { useEffect, useState } from "react";

export type Section =
  | "aujourdhui"
  | "objectifs"
  | "emploi-du-temps"
  | "lectures"
  | "moodboard"
  | "souvenirs";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "aujourdhui", label: "Aujourd'hui" },
  { id: "objectifs", label: "Objectifs" },
  { id: "emploi-du-temps", label: "Emploi du temps" },
  { id: "lectures", label: "Lectures" },
  { id: "moodboard", label: "Moodboard" },
  { id: "souvenirs", label: "Souvenirs" },
];

interface NavigationProps {
  active: Section;
  onChange: (section: Section) => void;
}

export function Navigation({ active, onChange }: NavigationProps) {
  const [open, setOpen] = useState(false);
  const current = SECTIONS.find((section) => section.id === active);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (section: Section) => {
    onChange(section);
    setOpen(false);
  };

  return (
    <>
      {/*
        Au téléphone, six libellés côte à côte tombaient à une taille illisible.
        Une barre haute nomme l'écran, et le menu s'ouvre en grand.
      */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-cerisier/50 bg-cerisier/30 px-4 backdrop-blur-sm sm:hidden">
        <p className="font-display uppercase text-label text-vin">{current?.label}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-label="Ouvrir le menu"
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-pill"
        >
          <svg viewBox="0 0 22 16" className="h-4 w-5" aria-hidden="true">
            <path
              d="M1 1h20M1 8h20M1 15h20"
              fill="none"
              stroke="var(--color-encre)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-creme px-6 py-5 sm:hidden">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              autoFocus
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-pill"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M4 4 L16 16 M16 4 L4 16"
                  fill="none"
                  stroke="var(--color-encre)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav aria-label="Navigation principale" className="mt-4 flex flex-col">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => go(section.id)}
                aria-current={active === section.id ? "page" : undefined}
                className={`rounded-card px-2 py-3 text-left font-display uppercase text-h1 transition-colors ${
                  active === section.id ? "text-vin" : "text-encre"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Tablette portrait : barre du bas. Tablette paysage : rail à gauche. */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 hidden grid-cols-6 items-center border-t border-cerisier/50 bg-cerisier/30 px-1 py-2 backdrop-blur-sm sm:grid
          lg:static lg:inset-auto lg:flex lg:h-screen lg:w-32 lg:flex-col lg:justify-start lg:gap-5 lg:border-t-0 lg:border-r lg:border-cerisier/50 lg:px-2 lg:py-8"
        aria-label="Navigation principale"
      >
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onChange(section.id)}
            aria-current={active === section.id ? "page" : undefined}
            className={`rounded-pill px-1 py-2 text-center text-micro leading-tight transition-colors lg:w-full ${
              active === section.id ? "text-vin font-semibold" : "text-encre/70"
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </>
  );
}
