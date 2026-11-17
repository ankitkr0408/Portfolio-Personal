import BlueprintHeading from "./BlueprintHeading";

export default function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="mb-12 space-y-4">
      {eyebrow && <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">{eyebrow}</p>}
      <BlueprintHeading className="text-5xl md:text-7xl">{title}</BlueprintHeading>
      {children && <p className="max-w-2xl text-lg text-neutral-200">{children}</p>}
    </header>
  );
}
