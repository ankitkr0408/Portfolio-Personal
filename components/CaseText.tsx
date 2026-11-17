import Highlighter from "./Highlighter";

// Renders `text`, wrapping the first occurrence of `phrase` in a Highlighter.
export default function CaseText({
  text,
  phrase,
  action,
  color,
}: {
  text: string;
  phrase?: string;
  action: "highlight" | "underline";
  color?: string;
}) {
  const i = phrase ? text.indexOf(phrase) : -1;
  if (!phrase || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <Highlighter action={action} color={color}>{phrase}</Highlighter>
      {text.slice(i + phrase.length)}
    </>
  );
}
