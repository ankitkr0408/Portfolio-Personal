"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { createSwapy } from "swapy";
import Avatar from "../Avatar";
import { profile, projects } from "@/lib/data";

const STACK = ["Next.js", "Node.js", "NestJS", "Python", "LLMs", "RAG", "AWS", "PostgreSQL", "CI/CD"];

const tile = "h-full w-full overflow-hidden rounded-3xl p-6 cursor-grab active:cursor-grabbing select-none";

export default function Bento() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const touch = window.matchMedia("(hover: none)").matches;
    const swapy = createSwapy(ref.current, {
      animation: "dynamic",
      swapMode: "hover",
      dragOnHold: touch, // on phones: press and hold to drag, so scrolling still works
    });
    return () => swapy.destroy();
  }, []);

  const feat = projects[0];

  return (
    <div>
      <div
        ref={ref}
        className="grid grid-cols-1 gap-4 md:auto-rows-[170px] md:grid-cols-4"
      >
        {/* Intro */}
        <div data-swapy-slot="intro" className="md:col-span-2 md:row-span-2">
          <div data-swapy-item="intro" className={`${tile} flex flex-col justify-between bg-neutral-900 border border-white/10`}>
            <Avatar src={profile.photo} name={profile.name} size={112} />
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">{profile.role}</p>
              <p className="mt-2 font-serif text-3xl italic leading-snug">
                I give businesses systems that run themselves.
              </p>
              <p className="mt-3 text-sm text-neutral-400">{profile.location} · working remotely</p>
            </div>
          </div>
        </div>

        {/* Build / Automate / Run */}
        <div data-swapy-slot="hats" className="md:col-span-2">
          <div data-swapy-item="hats" className={`${tile} flex flex-col justify-center bg-[#2d5df5] text-white`}>
            <p className="text-sm text-white/70">One engineer</p>
            <p className="mt-1 text-3xl font-bold leading-tight">Build it. Automate it. Keep it running.</p>
          </div>
        </div>

        {/* Availability */}
        <div data-swapy-slot="avail" className="md:col-span-1">
          <div data-swapy-item="avail" className={`${tile} flex flex-col justify-between bg-[#fff3a0] text-black`}>
            <span className="flex items-center gap-2 text-sm font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-green-600" /> Open to projects
            </span>
            <p className="text-sm text-black/70">Limited slots each quarter</p>
          </div>
        </div>

        {/* GitHub */}
        <div data-swapy-slot="gh" className="md:col-span-1">
          <div data-swapy-item="gh" className={`${tile} flex flex-col justify-between bg-neutral-900 border border-white/10`}>
            <p className="text-sm text-neutral-400">Open source</p>
            <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-lg font-semibold hover:underline">
              GitHub ↗
            </a>
          </div>
        </div>

        {/* Featured work */}
        <div data-swapy-slot="work" className="md:col-span-2">
          <div data-swapy-item="work" className={`${tile} flex flex-col justify-between bg-[#d6b4ff] text-black`}>
            <p className="text-sm text-black/60">Featured project</p>
            <div>
              <p className="text-2xl font-bold">{feat.title}</p>
              <p className="mt-1 text-sm text-black/70">{feat.blurb}</p>
              <Link href={`/projects/${feat.slug}`} className="mt-3 inline-block text-sm font-medium underline underline-offset-4">View project →</Link>
            </div>
          </div>
        </div>

        {/* Mentoring */}
        <div data-swapy-slot="mentor" className="md:col-span-1">
          <div data-swapy-item="mentor" className={`${tile} flex flex-col justify-between bg-[#f7d1e8] text-black`}>
            <span className="w-fit rounded-md border border-black/40 px-2 py-0.5 text-xs">JUDGE · MAR 2026</span>
            <Link href="/mentoring" className="font-semibold leading-snug hover:underline">PCE Hackathon 2026 →</Link>
          </div>
        </div>

        {/* Stack */}
        <div data-swapy-slot="stack" className="md:col-span-1">
          <div data-swapy-item="stack" className={`${tile} bg-neutral-900 border border-white/10`}>
            <p className="mb-3 text-sm text-neutral-400">Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {STACK.map((t) => (
                <span key={t} className="rounded-full border border-white/15 px-2 py-0.5 text-xs text-neutral-200">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div data-swapy-slot="contact" className="md:col-span-4">
          <div data-swapy-item="contact" className={`${tile} flex flex-col items-start justify-center gap-4 bg-white text-black md:flex-row md:items-center md:justify-between`}>
            <p className="font-serif text-3xl italic">Got a manual process to kill?</p>
            <a href={`mailto:${profile.email}?subject=Project%20inquiry`} className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white">
              {profile.email}
            </a>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-600">Tip: drag the tiles to rearrange them.</p>
    </div>
  );
}
