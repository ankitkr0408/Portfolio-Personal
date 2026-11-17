import BlueprintHeading from "../BlueprintHeading";

export default function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-20">
      {eyebrow && (
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
          {eyebrow}
        </p>
      )}
      <BlueprintHeading className="mb-12 text-5xl md:text-7xl">
        {title}
      </BlueprintHeading>
      {children}
    </section>
  );
}
