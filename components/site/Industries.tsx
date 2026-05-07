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
          {items.map((i, idx) => (
            <Reveal key={i} delay={idx * 0.04}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground hover:border-transparent">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {i}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
