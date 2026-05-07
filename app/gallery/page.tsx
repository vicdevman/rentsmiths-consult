'use client'
import { motion } from "framer-motion";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

const items = [
  { img: g1.src, title: "Class of 2024", desc: "Our largest cohort yet — 80+ students placed in top global universities." },
  { img: g2.src, title: "Visa Approval Day", desc: "Every stamp represents months of preparation and a future unlocked." },
  { img: g3.src, title: "Campus Life Begins", desc: "Students settling into their new universities across Canada and the UK." },
  { img: g4.src, title: "Departure Lounge", desc: "Saying goodbye is hard; sending them off ready makes it worth it." },
  { img: g5.src, title: "1:1 CV Reviews", desc: "Personal coaching sessions that turn good profiles into compelling applications." },
  { img: g6.src, title: "Pre-Departure Workshop", desc: "Cultural orientation, banking, housing, and academic prep — all in one room." },
];

export default function Gallery() {
  return (
    <>
      <section className="container-x pt-40 pb-16 sm:pt-48">
        <Reveal>
          <h1 className="max-w-3xl text-5xl sm:text-7xl">
            Moments that move us forward.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            A look behind the scenes — the students, the wins, and the workshops that make
            Rentsmiths what it is.
          </p>
        </Reveal>
      </section>

      <section className="container-x pb-24">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {items.map((it, i) => (
            <motion.figure
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group mb-6 break-inside-avoid overflow-hidden rounded-3xl bg-cream-deep"
            >
              <div className="overflow-hidden">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <figcaption className="p-6">
                <h3 className="font-display text-2xl">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
