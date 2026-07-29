interface StubPageProps {
  title: string;
}

export function StubPage({ title }: StubPageProps) {
  return (
    <div className="px-5 py-8 sm:px-8">
      <h1 className="font-display uppercase text-vin text-h1">
        {title}
      </h1>
      <p className="mt-2 text-small text-encre/70">Bientôt ici.</p>
    </div>
  );
}
