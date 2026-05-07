import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "./Reveal";
import s1 from "@/assets/service-1.jpg";
import s2 from "@/assets/service-2.jpg";
import s3 from "@/assets/service-3.jpg";

export const services = [
  {
    title: "University Admissions",
    desc: "Strategic university shortlisting, SOPs, and application packaging that gets you in.",
    img: s1,
    tag: "Most popular",
  },
  {
    title: "Scholarship Strategy",
    desc: "We surface and pursue scholarships that match your profile, scores, and ambitions.",
    img: s2,
  },
  {
    title: "Visa & Immigration",
    desc: "End-to-end visa documentation, mock interviews, and embassy follow-through.",
    img: s3,
  },
  {
    title: "Career Placement",
    desc: "International job matching, employer intros, and offer-stage negotiation support.",
    img: s1,
  },
  {
    title: "Test Prep Coaching",
    desc: "IELTS, TOEFL, GRE & GMAT prep with verified tutors and weekly mock sessions.",
    img: s2,
  },
  {
    title: "Post-Arrival Support",
    desc: "Housing, banking, SIM, and onboarding help so you settle in stress-free.",
    img: s3,
  },
];

export function Services({ limit }: { limit?: number }) {
  const items = limit ? services.slice(0, limit) : services;
  return (
    <section className="bg-cream-deep py-24 sm:py-32">
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
