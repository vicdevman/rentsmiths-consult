"use client"
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import { useSiteContent } from "@/components/site/SiteContentProvider";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const fallback = [
  { img: g1.src, title: "Class of 2024", desc: "Our largest cohort yet — 80+ students placed in top global universities." },
  { img: g2.src, title: "Visa Approval Day", desc: "Every stamp represents months of preparation and a future unlocked." },
  { img: g3.src, title: "Campus Life Begins", desc: "Students settling into their new universities across Canada and the UK." },
  { img: g4.src, title: "Departure Lounge", desc: "Saying goodbye is hard; sending them off ready makes it worth it." },
  { img: g5.src, title: "1:1 CV Reviews", desc: "Personal coaching sessions that turn good profiles into compelling applications." },
  { img: g6.src, title: "Pre-Departure Workshop", desc: "Cultural orientation, banking, housing, and academic prep — all in one room." },
];

export default function Gallery() {
  const { content } = useSiteContent();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);
  const wheelCooldownRef = useRef<number>(0);

  const fromDb = (content?.gallery ?? []).map((g) => ({
    img: g.imageUrl,
    title: g.title || "",
    desc: g.alt || "",
  }));

  const source = useMemo(() => (fromDb.length ? fromDb : fallback), [fromDb]);

  const active = openIndex === null ? null : source[openIndex];

  const close = () => setOpenIndex(null);
  const prev = () =>
    setOpenIndex((i) => {
      if (i === null) return i;
      return (i - 1 + source.length) % source.length;
    });
  const next = () =>
    setOpenIndex((i) => {
      if (i === null) return i;
      return (i + 1) % source.length;
    });

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, source.length]);

  useEffect(() => {
    if (openIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex]);

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

      <section id="gallery" className="container-x pb-24">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:balance]">
          {source.map((it, i) => (
            <motion.figure
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group mb-6 break-inside-avoid overflow-hidden rounded-3xl bg-cream-deep"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="block w-full text-left"
                data-cursor="interactive"
                data-cursor-scale="1.2"
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
              </button>
            </motion.figure>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {active && openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div className="absolute inset-0 flex flex-col">
              <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white/90">{active.title}</p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-3 text-white hover:bg-white/15 sm:flex"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-3 text-white hover:bg-white/15 sm:flex"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                <motion.div
                  key={`${active.img}-${openIndex}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  onTouchStart={(e) => {
                    touchStartX.current = e.touches[0]?.clientX ?? null;
                    touchDeltaX.current = 0;
                  }}
                  onTouchMove={(e) => {
                    if (touchStartX.current === null) return;
                    const x = e.touches[0]?.clientX ?? 0;
                    touchDeltaX.current = x - touchStartX.current;
                  }}
                  onTouchEnd={() => {
                    const dx = touchDeltaX.current;
                    touchStartX.current = null;
                    touchDeltaX.current = 0;
                    if (Math.abs(dx) < 40) return;
                    if (dx > 0) prev();
                    else next();
                  }}
                  onWheel={(e) => {
                    const now = Date.now();
                    if (now - wheelCooldownRef.current < 220) return;
                    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
                    wheelCooldownRef.current = now;
                    if (e.deltaY > 0) next();
                    else prev();
                  }}
                >
                  <img
                    src={active.img}
                    alt={active.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
                    <div className="h-40 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6">
                    <div className="mx-auto max-w-4xl text-left">
                      <h2 className="font-display text-2xl text-white sm:text-3xl">{active.title}</h2>
                      <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">{active.desc}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.28em] text-white/60">
                          Swipe / scroll to explore
                        </p>
                        <div className="flex items-center gap-2 sm:hidden">
                          <button
                            type="button"
                            onClick={prev}
                            className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-white/10 p-3 text-white"
                            aria-label="Previous"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={next}
                            className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-white/10 p-3 text-white"
                            aria-label="Next"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CtaBand />
    </>
  );
}
