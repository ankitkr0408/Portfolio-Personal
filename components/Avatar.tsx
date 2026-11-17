"use client";
import { useState } from "react";

export default function Avatar({ src, name, size = 160 }: { src: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <span style={{ width: size, height: size }} className="grid place-items-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 font-serif text-5xl italic text-white">
        {name[0]}
      </span>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={name} width={size} height={size} onError={() => setFailed(true)} style={{ width: size, height: size }} className="rounded-full border border-white/20 object-cover" />;
}
