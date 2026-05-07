import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function CtaBand() {
  return (
    <section className="container-x py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-primary-foreground sm:px-16 sm:py-24">
          <div
            className="absolute inset-0 -z-10 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, oklch(1 0 0 / 0.2) 0, transparent 40%), radial-gradient(circle at 80% 80%, oklch(0 0 0 / 0.25) 0, transparent 45%)",
            }}
          />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <h2 className="font-display text-4xl leading-[1.05] sm:text-6xl">
              Your global future starts with one conversation.
            </h2>
            <div className="flex flex-col items-start gap-4">
              <p className="text-primary-foreground/85">
                Book a free 30-minute strategy call and walk away with a clear next step — even if
                you don't sign with us.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-background px-6 py-3.5 text-sm font-semibold text-foreground"
              >
                Book your call
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
