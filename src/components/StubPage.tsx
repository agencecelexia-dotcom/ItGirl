interface StubPageProps {
  title: string;
}

export function StubPage({ title }: StubPageProps) {
  return (
    <div className="px-5 py-8 sm:px-8">
      <h1 className="font-display uppercase tracking-[0.03em] text-2xl sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-encre/60">Bientôt ici.</p>
    </div>
  );
}
