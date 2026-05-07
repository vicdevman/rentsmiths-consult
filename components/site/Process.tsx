import { Reveal } from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Discovery & Strategy",
    desc: "A free 30-minute call to map your goals, profile, and timeline into a clear plan.",
  },
  {
    n: "02",
    title: "Personalised Plan",
    desc: "We build your shortlist of universities, scholarships, or career tracks tailored to you.",
  },
  {
    n: "03",
    title: "Application & Submission",
    desc: "We handle SOPs, references, documents, and online forms — reviewed line by line.",
  },
  {
    n: "04",
    title: "Visa & Departure",
    desc: "Mock visa interviews, document binding, and a pre-departure briefing pack.",
  },
];

export function Process() {
  return (
    <section className="container-x py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <Reveal>
          <span className="pill">Our process</span>
          <h2 className="mt-4 text-4xl sm:text-5xl">
            A streamlined process for lasting results.
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            No vague promises, no chasing emails. A simple four-stage system that's helped hundreds
            of students reach the right campus, on time.
          </p>
        </Reveal>

        <div className="space-y-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="group flex items-start gap-5 rounded-3xl bg-cream-deep p-6 transition-colors hover:bg-primary hover:text-primary-foreground">
                <span className="font-display text-3xl text-primary group-hover:text-primary-foreground">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-xl">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground group-hover:text-primary-foreground/85">
                    {s.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
