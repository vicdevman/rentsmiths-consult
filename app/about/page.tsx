'use client'

import { Reveal } from "@/components/site/Reveal";
import { Stats } from "@/components/site/Stats";
import { Testimonials } from "@/components/site/Testimonials";
import { CtaBand } from "@/components/site/CtaBand";
import breakImg from "@/assets/break.jpg";


export default function About() {
  return (
    <>
      <section className="container-x pt-40 pb-16 sm:pt-48">
        <Reveal>
          <h1 className="max-w-3xl text-5xl sm:text-7xl">
            A consultancy built on outcomes, not promises.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Rentsmiths Global Consults has spent years quietly building one of West Africa's most
            trusted international education and career pipelines — partnering with universities,
            employers, and embassies across four continents.
          </p>
        </Reveal>
      </section>

      <section className="container-x pb-24">
        <Reveal>
          <img
            src={breakImg.src}
            alt="Rentsmiths team"
            loading="lazy"
            className="h-[60vh] w-full rounded-[2.5rem] object-cover"
          />
        </Reveal>
      </section>

      <section className="container-x grid gap-12 pb-24 lg:grid-cols-2">
        <Reveal>
          <h2 className="text-4xl">Our mission</h2>
          <p className="mt-4 text-muted-foreground">
            To remove the friction between ambition and opportunity. Every student deserves a fair
            shot at a world-class education — and every professional deserves a global career path
            built on merit.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-4xl">Our values</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li>— Personal: you'll always speak to a real consultant.</li>
            <li>— Transparent: clear timelines, clear fees, no surprises.</li>
            <li>— Outcome-driven: we measure ourselves on offers and visas, not pitches.</li>
            <li>— Long-term: we stay with you through arrival and beyond.</li>
          </ul>
        </Reveal>
      </section>

      <Stats />
      <Testimonials />
      <CtaBand />
    </>
  );
}
