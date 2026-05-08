'use client'

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "./Reveal";
import s1 from "@/assets/service-1.jpg";
import s2 from "@/assets/service-2.jpg";
import s3 from "@/assets/service-3.jpg";
import { useSiteContent } from "@/components/site/SiteContentProvider";

export const services = [
  {
    title: "Study abroad",
    desc: "End-to-end guidance from school selection to SOP/CV and applications — so you get offers faster with less stress.",
    img: s1,
    tag: "Most popular",
  },
  {
    title: "Work abroad",
    desc: "We help you position your profile, target the right roles, and prepare for interviews to land international opportunities.",
    img: s2,
  },
  {
    title: "Scholarships",
    desc: "Scholarship matching, compelling essays, and deadline management — built to maximize funding and acceptance odds.",
    img: s3,
  },
  {
    title: "Trainings",
    desc: "Practical trainings to upgrade your skills and profile — from test prep to career-ready coaching and portfolio reviews.",
    img: s1,
  },
  {
    title: "Visa / work permit",
    desc: "Documentation, forms, timelines, and mock interviews — with checks that reduce errors and costly delays.",
    img: s2,
  },
  {
    title: "Online university",
    desc: "Flexible online degree options with credible institutions — ideal if you need quality education without relocating.",
    img: s3,
  },
];

export function Services({ limit }: { limit?: number }) {
  const { content } = useSiteContent();
  const fallback = services.map((s) => ({
    title: s.title,
    desc: s.desc,
    img: s.img,
    tag: s.tag,
  }));

  const fromDb = (content?.services ?? []).map((s) => ({
    title: s.title,
    desc: s.description,
    img: { src: s.imageUrl || s1.src },
    tag: s.tag,
  }));

  const source = fromDb.length ? fromDb : fallback;
  const items = limit ? source.slice(0, limit) : source;
  return (
    <section id="services" className="bg-cream-deep py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="text-center">
          <span className="pill">Our services</span>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl sm:text-5xl">
            Expert services to drive your global growth.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={s.title + i} delay={i * 0.06}>
              <article className="group relative h-full overflow-hidden rounded-3xl bg-ink text-cream shadow-soft">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={s.img.src}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {s.tag && (
                    <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                      {s.tag}
                    </span>
                  )}
                  <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-cream text-ink transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{s.title}</h3>
                  <p className="mt-2 text-sm text-cream/70">{s.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {limit && (
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-pop"
            >
              View all services
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
