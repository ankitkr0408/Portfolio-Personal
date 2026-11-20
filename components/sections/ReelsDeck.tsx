"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";

export type ReelItem = {
  id: string;
  title: string;
  caption: string;
  // "youtube" | "instagram" | "video"
  type: "youtube" | "instagram" | "video";
  // YouTube video/short ID, Instagram reel URL or embed URL, or direct video URL
  embedUrl: string;
  // Optional poster/thumbnail image
  thumbnail?: string;
};

// Default sample reels - replace with your own YouTube Shorts or Instagram Reels!
const DEFAULT_REELS: ReelItem[] = [
  {
    id: "reel-1",
    title: "Viral Beats & Groove",
    caption: "BIG GROOVE",
    type: "youtube",
    embedUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk?autoplay=1&mute=0&controls=1",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "reel-2",
    title: "Next-Gen Tech & Trailer",
    caption: "GTA VI",
    type: "youtube",
    embedUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8?autoplay=1&mute=0&controls=1",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "reel-3",
    title: "Viral Delivery Drone AI",
    caption: "DELIVERY GRANNY",
    type: "youtube",
    embedUrl: "https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&mute=0&controls=1",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "reel-4",
    title: "Never Gonna Give You Up",
    caption: "VAN BARNEVELD",
    type: "youtube",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&controls=1",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
  },
];

// Resting transforms for 4 cards (fanned / clustered together)
const RESTING_CONFIG = [
  { rotate: -7, translateY: 10 },
  { rotate: -2, translateY: -6 },
  { rotate: 2, translateY: 4 },
  { rotate: 7, translateY: 12 },
];

// Generous spreading ("freely side") when hovering the deck
const SPREAD_CONFIG = [
  { translateX: -130, rotate: -4 },
  { translateX: -42, rotate: -1 },
  { translateX: 42, rotate: 1 },
  { translateX: 130, rotate: 4 },
];

export default function ReelsDeck({ items = DEFAULT_REELS }: { items?: ReelItem[] }) {
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activePlayId, setActivePlayId] = useState<string | null>(null);

  return (
    <section className="relative w-full overflow-hidden bg-[#0c120c] py-20 text-white selection:bg-lime-400 selection:text-black">
      {/* Decorative neon lightning bolts on edges */}
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lime-400 opacity-80 md:left-12 lg:left-20">
        <svg
          className="h-28 w-12 md:h-44 md:w-20"
          viewBox="0 0 100 220"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 60 10 L 15 90 L 55 95 L 20 210 L 85 105 L 45 100 Z" />
        </svg>
      </div>

      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lime-400 opacity-80 md:right-12 lg:right-20">
        <svg
          className="h-28 w-12 md:h-44 md:w-20"
          viewBox="0 0 100 220"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 40 10 L 85 90 L 45 95 L 80 210 L 15 105 L 55 100 Z" />
        </svg>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center px-4">
        {/* Main interactive cards container */}
        <div
          className="relative flex items-center justify-center py-12"
          onMouseEnter={() => setIsDeckHovered(true)}
          onMouseLeave={() => {
            setIsDeckHovered(false);
            setHoveredIdx(null);
          }}
        >
          <div className="flex items-end justify-center -space-x-6 sm:-space-x-8 md:-space-x-10 lg:-space-x-12">
            {items.map((item, idx) => {
              const isHovered = hoveredIdx === idx;
              const resting = RESTING_CONFIG[idx % RESTING_CONFIG.length];
              const spread = SPREAD_CONFIG[idx % SPREAD_CONFIG.length];

              // Calculate active transform based on hover state
              let translateX = isDeckHovered ? spread.translateX : 0;
              let rotate = isDeckHovered ? spread.rotate : resting.rotate;
              let translateY = resting.translateY;
              let scale = 1;
              let zIndex = 10 + idx;

              if (isHovered) {
                // Focus card: pops out, straightens, scales up, highest z-index
                scale = 1.12;
                rotate = 0;
                translateY = -28;
                zIndex = 50;
              } else if (hoveredIdx !== null) {
                // Sibling cards give generous breathing space to the hovered card
                if (idx < hoveredIdx) {
                  translateX -= 45;
                  rotate -= 2;
                } else {
                  translateX += 45;
                  rotate += 2;
                }
              }

              const isPlaying = activePlayId === item.id;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className="flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform"
                  style={{
                    transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                    zIndex,
                  }}
                >
                  {/* Phone-shaped card */}
                  <div
                    onClick={() => setActivePlayId(isPlaying ? null : item.id)}
                    className="group relative h-[320px] w-[180px] cursor-pointer overflow-hidden rounded-[26px] border-[3px] border-black/40 bg-neutral-900 shadow-2xl transition-shadow duration-300 hover:shadow-lime-400/20 sm:h-[400px] sm:w-[220px] sm:rounded-[32px] md:h-[460px] md:w-[250px] md:rounded-[36px]"
                  >
                    {/* Embedded Content */}
                    {isPlaying ? (
                      item.type === "youtube" ? (
                        <iframe
                          src={`${item.embedUrl}${item.embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
                          title={item.title}
                          className="h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : item.type === "instagram" ? (
                        <iframe
                          src={item.embedUrl}
                          title={item.title}
                          className="h-full w-full border-0"
                          allowTransparency
                        />
                      ) : (
                        <video
                          src={item.embedUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      /* Poster / Thumbnail Preview */
                      <div className="relative h-full w-full">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-neutral-800 to-neutral-950 p-4 text-center text-xs text-neutral-400">
                            {item.title}
                          </div>
                        )}

                        {/* Subtle dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                        {/* Play / Sound badge overlay (similar to bottom yellow button in screenshot) */}
                        <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-lime-400 text-black shadow-lg transition-transform duration-200 group-hover:scale-110">
                          <svg className="h-4 w-4 fill-current ml-0.5" viewBox="0 0 24 24">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Caption underneath card (tilted pink bold font) */}
                  <span className="mt-3 select-none text-xs font-bold uppercase tracking-wider text-pink-300 drop-shadow-md sm:text-sm md:text-base font-iceberg">
                    {item.caption}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section title (optional bottom banner as in the screenshot "WHAT'S ON") */}
        <h2 className="mt-8 text-center text-4xl font-black uppercase tracking-tight text-lime-400 md:text-7xl lg:text-8xl">
          What&apos;s On
        </h2>
      </div>
    </section>
  );
}
