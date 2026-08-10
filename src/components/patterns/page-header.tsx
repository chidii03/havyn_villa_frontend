export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-line bg-muted/40">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {eyebrow && <p className="text-sm font-medium text-brand">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-ink-muted">{description}</p>}
      </div>
    </div>
  );
}