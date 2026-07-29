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
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 grid grid-cols-6 items-center border-t border-ligne bg-creme px-1 py-2
        lg:static lg:inset-auto lg:flex lg:h-screen lg:w-28 lg:flex-col lg:justify-start lg:gap-6 lg:border-t-0 lg:border-r lg:py-8"
      aria-label="Navigation principale"
    >
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onChange(section.id)}
          aria-current={active === section.id ? "page" : undefined}
          className={`rounded-pill px-1 py-1.5 text-center text-micro leading-tight font-sans transition-colors lg:w-full lg:px-2 lg:text-micro ${
            active === section.id ? "text-encre font-medium" : "text-encre/70"
          }`}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}
