'use client'

import { Reveal } from "./Reveal";

const items = [
  "Engineering & Tech",
  "Business & MBA",
  "Healthcare & Nursing",
  "Data & AI",
  "Creative Arts",
  "Hospitality",
  "Finance",
  "Architecture",
];

const palette = [
  "violet",
  "emerald",
  "teal",
  "indigo",
  "rose",
  "amber",
  "slate",
  "sky",
];

// Tailwind requires class names to be statically analyzable.
// Map each palette name to explicit class strings so JIT picks them up.
const colorClasses: Record<string, string> = {
  violet: "bg-violet-500 text-white hover:bg-violet-600",
  emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
  teal: "bg-teal-500 text-white hover:bg-teal-600",
  indigo: "bg-indigo-500 text-white hover:bg-indigo-600",
  rose: "bg-rose-500 text-white hover:bg-rose-600",
  amber: "bg-amber-500 text-white hover:bg-amber-600",
  slate: "bg-orange-500 text-white hover:bg-orange-600",
  sky: "bg-sky-500 text-white hover:bg-sky-600",
};

export function Industries() {
  return (
    <section className="bg-cream-deep py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="text-center">
          <span className="pill">Industries</span>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl sm:text-5xl">
            Industry-specific expertise to drive your success.
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {items.map((i, idx) => {
            const c = palette[idx % palette.length];
            const classes = colorClasses[c] ?? "bg-slate-500 text-white hover:bg-slate-600";
            return (
              <Reveal key={i} delay={idx * 0.04}>
                <span
                  className={`inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium transition-all whitespace-nowrap ${classes}`}
                >
                  {i}
                </span>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
