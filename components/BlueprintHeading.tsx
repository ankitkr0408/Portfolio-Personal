// Outlined "blueprint" heading that fills in on hover.
export default function BlueprintHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`blueprint font-bold uppercase tracking-tight leading-none ${className}`}
    >
      {children}
    </h2>
  );
}
