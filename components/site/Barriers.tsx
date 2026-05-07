import { Check } from "lucide-react";
import { Reveal } from "./Reveal";
import barriersImg from "@/assets/barriers.jpg";

const points = [
  "Confusing university choices and admission requirements",
  "Visa rejections from poorly prepared applications",
  "Scholarships you qualify for but never hear about",
  "No clear roadmap from offer letter to landing day",
];

export function Barriers() {
  return (
    <section className="container-x py-24 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="pill">The barriers</span>
          <h2 className="mt-4 max-w-md text-4xl sm:text-5xl">
            Overcoming these key barriers starts here today.
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Most aspiring students stall on the same handful of obstacles. We've solved them
            hundreds of times — so you don't have to.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-2xl bg-cream-deep p-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium">{p}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-primary/15" />
            <img
              src={barriersImg.src}
              alt="Student deciding next steps"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-soft"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-background p-4 shadow-pop sm:block">
              <p className="font-display text-3xl text-primary">98%</p>
              <p className="text-xs text-muted-foreground">visa success rate</p>
            </div>
            <div className="absolute -top-6 -right-6 hidden rotate-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-pop sm:block">
              <p className="text-xs uppercase tracking-[0.2em]">Avg.</p>
              <p className="font-display text-2xl">6 weeks</p>
              <p className="text-[10px]">to admission</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
